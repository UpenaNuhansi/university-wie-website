import { useEffect, useState, useRef } from "react";
import { getEvents } from "../services/eventService";
import { useNavigate } from "react-router-dom";

/* ─────────────────────────────────────────────
   Inject global styles once (fonts + keyframes)
───────────────────────────────────────────── */
const GLOBAL_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --purple-950: #2d0a4e;
    --purple-900: #4a1572;
    --purple-800: #6b21a8;
    --purple-700: #7e22ce;
    --purple-600: #9333ea;
    --purple-200: #e9d5ff;
    --purple-100: #f3e8ff;
    --pink-600:   #db2777;
    --pink-700:   #be185d;
    --bg-base:    #f6eef7;
    --white:      #ffffff;
    --gray-600:   #4b5563;
    --gray-500:   #6b7280;
    --gray-200:   #e5e7eb;
    --gray-100:   #f3f4f6;
  }

  @keyframes floatDate {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-4px); }
  }
  @keyframes pulse-ring {
    0%   { box-shadow: 0 0 0 0 rgba(147,51,234,0.25); }
    70%  { box-shadow: 0 0 0 10px rgba(147,51,234,0); }
    100% { box-shadow: 0 0 0 0 rgba(147,51,234,0); }
  }
`;

function injectStyles() {
  if (document.getElementById("events-global-style")) return;
  const el = document.createElement("style");
  el.id = "events-global-style";
  el.textContent = GLOBAL_STYLE;
  document.head.appendChild(el);
}

/* ─────────────────────────────────────────────
   Intersection-observer hook for scroll reveals
───────────────────────────────────────────── */
function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ─────────────────────────────────────────────
   Small meta row
───────────────────────────────────────────── */
function Meta({ icon, text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "13px", color: "var(--gray-600)" }}>
      <span style={{ fontSize: "14px", flexShrink: 0 }}>{icon}</span>
      <span>{text}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Section heading with animated underline
───────────────────────────────────────────── */
function SectionHeading({ children, visible }) {
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <h2 style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "clamp(28px, 4vw, 38px)",
        fontWeight: "700",
        color: "var(--purple-900)",
        margin: 0,
        lineHeight: 1.15,
        letterSpacing: "-0.01em",
      }}>{children}</h2>
      <div style={{
        position: "absolute",
        bottom: "-6px",
        left: 0,
        right: 0,
        height: "2.5px",
        background: "linear-gradient(90deg, var(--purple-700), var(--pink-600))",
        borderRadius: "999px",
        transformOrigin: "left",
        transform: visible ? "scaleX(1)" : "scaleX(0)",
        transition: "transform 0.7s cubic-bezier(0.22,1,0.36,1) 0.2s",
      }} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Upcoming Event Card
───────────────────────────────────────────── */
function UpcomingCard({ event, index, onClick }) {
  const [ref, visible] = useReveal();
  const [hovered, setHovered] = useState(false);
  const eventDate = new Date(event.date);
  const day   = eventDate.getDate();
  const month = eventDate.toLocaleDateString("en-US", { month: "short" });
  const registrationEnabled = event.registrationEnabled ?? event.allowRegister;
  const registrationLink = event.registrationLink || event.registerLink;
  const registrationLabel = event.registrationLabel || (event.registrationType === "google" ? "Open Google Form" : "Register Now");

  return (
    <div
      ref={ref}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--white)",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: hovered
          ? "0 24px 60px rgba(74,21,114,0.18), 0 4px 16px rgba(74,21,114,0.08)"
          : "0 4px 24px rgba(74,21,114,0.07)",
        cursor: "pointer",
        transform: visible
          ? hovered ? "translateY(-6px) scale(1.005)" : "translateY(0) scale(1)"
          : "translateY(32px)",
        opacity: visible ? 1 : 0,
        transition: `
          transform 0.55s cubic-bezier(0.22,1,0.36,1) ${index * 80}ms,
          opacity   0.55s ease ${index * 80}ms,
          box-shadow 0.35s ease
        `,
        display: "flex",
        flexDirection: "column",
        fontFamily: "'DM Sans', sans-serif",
        border: "1px solid rgba(147,51,234,0.06)",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <img
          src={event.image}
          alt={event.title}
          style={{
            width: "100%",
            height: "220px",
            objectFit: "cover",
            display: "block",
            transform: hovered ? "scale(1.06)" : "scale(1)",
            transition: "transform 0.65s cubic-bezier(0.22,1,0.36,1)",
          }}
        />
        {/* Gradient overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, rgba(45,10,78,0.12) 0%, rgba(45,10,78,0.45) 100%)",
          transition: "opacity 0.35s",
          opacity: hovered ? 0.85 : 0.6,
        }} />

        {/* Date badge */}
        <div style={{
          position: "absolute", top: "16px", left: "16px",
          background: "var(--purple-800)",
          color: "var(--white)",
          borderRadius: "12px",
          padding: "10px 14px",
          textAlign: "center",
          boxShadow: "0 4px 20px rgba(107,33,168,0.4)",
          animation: visible ? `floatDate 3.5s ease-in-out ${index * 200 + 600}ms infinite` : "none",
          minWidth: "54px",
        }}>
          <div style={{ fontSize: "26px", fontWeight: "700", lineHeight: 1, fontFamily: "'Cormorant Garamond', serif" }}>{day}</div>
          <div style={{ fontSize: "11px", fontWeight: "600", letterSpacing: "0.08em", marginTop: "2px", opacity: 0.9 }}>{month.toUpperCase()}</div>
        </div>

        {/* Type badges */}
        <div style={{ position: "absolute", bottom: "14px", left: "14px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {event.eventType && (
            <span style={{
              background: "rgba(147,51,234,0.88)",
              backdropFilter: "blur(8px)",
              color: "#fff",
              padding: "4px 12px",
              borderRadius: "999px",
              fontSize: "11px",
              fontWeight: "600",
              letterSpacing: "0.06em",
            }}>{event.eventType}</span>
          )}
          {event.format && (
            <span style={{
              background: "rgba(255,255,255,0.22)",
              backdropFilter: "blur(8px)",
              color: "#fff",
              padding: "4px 12px",
              borderRadius: "999px",
              fontSize: "11px",
              fontWeight: "500",
              letterSpacing: "0.04em",
              border: "1px solid rgba(255,255,255,0.3)",
            }}>{event.format}</span>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "22px 24px 24px", flex: 1, display: "flex", flexDirection: "column" }}>
        <h3 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "21px",
          fontWeight: "600",
          color: "var(--purple-900)",
          margin: "0 0 12px",
          lineHeight: 1.3,
        }}>{event.title}</h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "12px" }}>
          <Meta icon="🕐" text={event.time || "09:00 AM – 04:00 PM UKT"} />
          <Meta icon="📍" text={event.location} />
        </div>

        <p style={{
          fontSize: "13.5px",
          color: "var(--gray-600)",
          lineHeight: 1.65,
          margin: "0 0 20px",
          flex: 1,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>{event.description}</p>

        {registrationEnabled && registrationLink ? (
          <a
            href={registrationLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            style={{
              display: "block",
              textAlign: "center",
              background: "linear-gradient(135deg, var(--pink-600) 0%, #c026d3 100%)",
              color: "#fff",
              padding: "12px 20px",
              borderRadius: "10px",
              fontWeight: "600",
              fontSize: "14px",
              letterSpacing: "0.04em",
              textDecoration: "none",
              transition: "opacity 0.25s, transform 0.25s, box-shadow 0.25s",
              boxShadow: "0 4px 16px rgba(219,39,119,0.35)",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.opacity = "0.88";
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow = "0 8px 28px rgba(219,39,119,0.45)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(219,39,119,0.35)";
            }}
          >
            {registrationLabel} →
          </a>
        ) : (
          <button style={{
            width: "100%",
            background: "var(--gray-100)",
            color: "var(--gray-500)",
            padding: "12px 20px",
            borderRadius: "10px",
            border: "none",
            fontWeight: "600",
            fontSize: "14px",
            cursor: "default",
            fontFamily: "'DM Sans', sans-serif",
          }}>
            Registration Closed
          </button>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Past Event Card
───────────────────────────────────────────── */
function PastCard({ event, index, onClick }) {
  const [ref, visible] = useReveal();
  const [hovered, setHovered] = useState(false);
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  }).toUpperCase();

  return (
    <div
      ref={ref}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--white)",
        borderRadius: "20px",
        overflow: "hidden",
        cursor: "pointer",
        boxShadow: hovered
          ? "0 20px 50px rgba(74,21,114,0.14)"
          : "0 2px 16px rgba(74,21,114,0.06)",
        transform: visible
          ? hovered ? "translateY(-5px)" : "translateY(0)"
          : "translateY(28px)",
        opacity: visible ? 1 : 0,
        transition: `
          transform 0.5s cubic-bezier(0.22,1,0.36,1) ${index * 70}ms,
          opacity   0.5s ease ${index * 70}ms,
          box-shadow 0.3s ease
        `,
        fontFamily: "'DM Sans', sans-serif",
        border: "1px solid rgba(147,51,234,0.05)",
      }}
    >
      <div style={{ position: "relative", overflow: "hidden" }}>
        <img
          src={event.image}
          alt={event.title}
          style={{
            width: "100%",
            height: "200px",
            objectFit: "cover",
            display: "block",
            filter: hovered ? "grayscale(0%)" : "grayscale(20%)",
            transform: hovered ? "scale(1.05)" : "scale(1)",
            transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1), filter 0.4s",
          }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, transparent 50%, rgba(45,10,78,0.52) 100%)",
        }} />
        <div style={{
          position: "absolute", bottom: "14px", left: "16px",
          fontSize: "10px",
          fontWeight: "700",
          letterSpacing: "0.12em",
          color: "rgba(255,255,255,0.85)",
        }}>{formattedDate}</div>
      </div>

      <div style={{ padding: "20px 22px 22px" }}>
        <h3 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "19px",
          fontWeight: "600",
          color: "var(--purple-900)",
          margin: "0 0 10px",
          lineHeight: 1.3,
        }}>{event.title}</h3>

        <p style={{
          fontSize: "13px",
          color: "var(--gray-600)",
          lineHeight: 1.65,
          margin: "0 0 16px",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>{event.description}</p>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {event.youtubeLink && (
            <a
              href={event.youtubeLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                color: "#ff0000",
                fontWeight: "600",
                fontSize: "13.5px",
                textDecoration: "none",
                transition: "gap 0.2s, opacity 0.2s, transform 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.gap = "10px"; e.currentTarget.style.opacity = "0.75"; e.currentTarget.style.transform = "scale(1.05)"; }}
              onMouseLeave={e => { e.currentTarget.style.gap = "6px"; e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1)"; }}
            >
              ▶ YouTube
            </a>
          )}
          {event.facebookLink && (
            <a
              href={event.facebookLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                color: "#1877f2",
                fontWeight: "600",
                fontSize: "13.5px",
                textDecoration: "none",
                transition: "gap 0.2s, opacity 0.2s, transform 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.gap = "10px"; e.currentTarget.style.opacity = "0.75"; e.currentTarget.style.transform = "scale(1.05)"; }}
              onMouseLeave={e => { e.currentTarget.style.gap = "6px"; e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1)"; }}
            >
              f Facebook
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Page Component
───────────────────────────────────────────── */
export default function Events() {
  const [events, setEvents]       = useState([]);
  const [heroReady, setHeroReady] = useState(false);
  const [upcomingRef, upcomingVisible] = useReveal(0.05);
  const [pastRef, pastVisible]         = useReveal(0.05);
  const [ctaRef, ctaVisible]           = useReveal(0.15);
  const [showMorePastEvents, setShowMorePastEvents] = useState(false);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const navigate = useNavigate();

  // Function to get week number for a date
  const getWeekKey = (date) => {
    const d = new Date(date);
    const firstDay = new Date(d.getFullYear(), 0, 1);
    const pastDaysOfYear = (d - firstDay) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDay.getDay() + 1) / 7);
  };

  // Function to get week start date
  const getWeekStart = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
    return new Date(d.setDate(diff));
  };

  // Group events by week
  const groupEventsByWeek = (eventsList) => {
    const weeks = {};
    eventsList.forEach(event => {
      const weekStart = getWeekStart(event.date);
      const weekKey = weekStart.toISOString().split('T')[0];
      if (!weeks[weekKey]) {
        weeks[weekKey] = { start: weekStart, events: [] };
      }
      weeks[weekKey].events.push(event);
    });
    return Object.values(weeks).sort((a, b) => a.start - b.start);
  };

  useEffect(() => {
    injectStyles();
    const t = setTimeout(() => setHeroReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    (async () => {
      const data = await getEvents();
      setEvents(data);
    })();
  }, []);

  const upcoming = events.filter(e => new Date(e.date) > new Date());
  const past     = events.filter(e => new Date(e.date) <= new Date());
  const upcomingWeeks = groupEventsByWeek(upcoming);
  const currentWeekEvents = upcomingWeeks[currentWeekIndex]?.events || [];

  return (
    <div style={{ background: "var(--bg-base)", fontFamily: "'DM Sans', sans-serif", overflowX: "hidden" }}>

      {/* ── HERO ── */}
      <section style={{
        padding: "clamp(80px, 12vw, 130px) 24px clamp(70px, 10vw, 110px)",
        textAlign: "center",
        background: "linear-gradient(180deg, #ede0f5 0%, var(--bg-base) 100%)",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative blobs */}
        <div style={{
          position: "absolute", top: "-60px", left: "-80px",
          width: "380px", height: "380px",
          background: "radial-gradient(circle, rgba(147,51,234,0.12) 0%, transparent 70%)",
          borderRadius: "50%", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "-40px", right: "-60px",
          width: "300px", height: "300px",
          background: "radial-gradient(circle, rgba(219,39,119,0.1) 0%, transparent 70%)",
          borderRadius: "50%", pointerEvents: "none",
        }} />

        {/* Badge */}
        <div style={{
          opacity: heroReady ? 1 : 0,
          transform: heroReady ? "translateY(0)" : "translateY(-12px)",
          transition: "opacity 0.6s ease, transform 0.6s cubic-bezier(0.22,1,0.36,1)",
          marginBottom: "22px",
        }}>
          <span style={{
            display: "inline-block",
            background: "linear-gradient(135deg, var(--purple-800), #9333ea)",
            color: "#fff",
            padding: "7px 20px",
            borderRadius: "999px",
            fontSize: "11px",
            fontWeight: "700",
            letterSpacing: "0.12em",
            boxShadow: "0 4px 20px rgba(107,33,168,0.3)",
            animation: heroReady ? "pulse-ring 2.8s ease-out 1.2s infinite" : "none",
          }}>
            EMPOWERING WOMEN IN STEM
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(42px, 7vw, 72px)",
          fontWeight: "700",
          color: "var(--purple-900)",
          margin: "0 auto 20px",
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          maxWidth: "780px",
          opacity: heroReady ? 1 : 0,
          transform: heroReady ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.7s ease 0.12s, transform 0.7s cubic-bezier(0.22,1,0.36,1) 0.12s",
        }}>
          Discover Our{" "}
          <em style={{ fontStyle: "italic", color: "var(--purple-700)" }}>Events</em>
        </h1>

        {/* Subtext */}
        <p style={{
          fontSize: "clamp(15px, 1.8vw, 17.5px)",
          color: "var(--gray-600)",
          maxWidth: "560px",
          margin: "0 auto",
          lineHeight: 1.75,
          fontWeight: "300",
          opacity: heroReady ? 1 : 0,
          transform: heroReady ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.7s ease 0.24s, transform 0.7s cubic-bezier(0.22,1,0.36,1) 0.24s",
        }}>
          Join us for workshops, technical sessions, and networking opportunities designed
          to elevate your professional journey in technology and engineering.
        </p>

        {/* Decorative pill */}
        <div style={{
          width: "60px", height: "3px",
          background: "linear-gradient(90deg, var(--purple-700), var(--pink-600))",
          borderRadius: "999px",
          margin: "32px auto 0",
          opacity: heroReady ? 1 : 0,
          transition: "opacity 0.6s ease 0.4s",
        }} />
      </section>

      {/* ── UPCOMING ── */}
      <section style={{ padding: "clamp(48px, 8vw, 88px) clamp(20px, 6vw, 72px)" }}>
        <div ref={upcomingRef} style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "clamp(28px, 4vw, 48px)",
          flexWrap: "wrap",
          gap: "12px",
        }}>
          <div>
            <SectionHeading visible={upcomingVisible}>Upcoming Events</SectionHeading>
            {upcomingWeeks.length > 0 && currentWeekEvents.length > 0 && (
              <p style={{
                fontSize: "13px",
                color: "var(--gray-600)",
                margin: "8px 0 0",
                fontWeight: "300",
              }}>
                Week of {upcomingWeeks[currentWeekIndex].start.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                })}
              </p>
            )}
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            {["←", "→"].map((arrow, i) => (
              <button 
                key={i}
                disabled={upcomingWeeks.length <= 1}
                onClick={() => {
                  if (arrow === "←") {
                    setCurrentWeekIndex(Math.max(0, currentWeekIndex - 1));
                  } else {
                    setCurrentWeekIndex(Math.min(upcomingWeeks.length - 1, currentWeekIndex + 1));
                  }
                }}
                style={{
                  width: "42px", height: "42px",
                  borderRadius: "50%",
                  border: "2px solid var(--purple-200)",
                  background: upcomingWeeks.length <= 1 ? "var(--gray-100)" : "var(--white)",
                  color: upcomingWeeks.length <= 1 ? "var(--gray-400)" : "var(--purple-700)",
                  fontSize: "16px",
                  cursor: upcomingWeeks.length <= 1 ? "default" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.2s, border-color 0.2s, color 0.2s, transform 0.2s",
                  fontFamily: "'DM Sans', sans-serif",
                }}
                onMouseEnter={e => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.background = "var(--purple-900)";
                    e.currentTarget.style.color = "#fff";
                    e.currentTarget.style.borderColor = "var(--purple-900)";
                    e.currentTarget.style.transform = "scale(1.1)";
                  }
                }}
                onMouseLeave={e => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.background = "var(--white)";
                    e.currentTarget.style.color = "var(--purple-700)";
                    e.currentTarget.style.borderColor = "var(--purple-200)";
                    e.currentTarget.style.transform = "scale(1)";
                  }
                }}
              >{arrow}</button>
            ))}
          </div>
        </div>

        {upcoming.length === 0 ? (
          <p style={{ color: "var(--gray-500)", fontStyle: "italic", textAlign: "center", padding: "40px 0" }}>
            No upcoming events at the moment. Check back soon!
          </p>
        ) : currentWeekEvents.length === 0 ? (
          <p style={{ color: "var(--gray-500)", fontStyle: "italic", textAlign: "center", padding: "40px 0" }}>
            No events this week.
          </p>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "clamp(18px, 2.5vw, 30px)",
          }}>
            {currentWeekEvents.map((event, i) => (
              <UpcomingCard
                key={event.id}
                event={event}
                index={i}
                onClick={() => navigate(`/events/${event.id}`)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Divider */}
      <div style={{
        margin: "0 clamp(20px, 6vw, 72px)",
        height: "1px",
        background: "linear-gradient(90deg, transparent, var(--purple-200), transparent)",
      }} />

      {/* ── PAST EVENTS ── */}
      <section style={{ padding: "clamp(48px, 8vw, 88px) clamp(20px, 6vw, 72px)" }}>
        <div ref={pastRef} style={{ marginBottom: "clamp(28px, 4vw, 48px)" }}>
          <SectionHeading visible={pastVisible}>Past Events</SectionHeading>
        </div>

        {past.length === 0 ? (
          <p style={{ color: "var(--gray-500)", fontStyle: "italic", textAlign: "center", padding: "40px 0" }}>
            No past events yet.
          </p>
        ) : (
          <>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "clamp(16px, 2.5vw, 28px)",
            }}>
              {past.slice(0, showMorePastEvents ? past.length : 4).map((event, i) => (
                <PastCard
                  key={event.id}
                  event={event}
                  index={i}
                  onClick={() => navigate(`/events/${event.id}`)}
                />
              ))}
            </div>

            {/* Load More Button */}
            {past.length > 4 && (
              <div style={{ display: "flex", justifyContent: "center", marginTop: "clamp(36px, 5vw, 56px)" }}>
                <button style={{
                  border: "2px solid var(--purple-900)",
                  background: "transparent",
                  color: "var(--purple-900)",
                  padding: "13px 40px",
                  borderRadius: "10px",
                  fontWeight: "600",
                  fontSize: "14px",
                  letterSpacing: "0.04em",
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "background 0.3s, color 0.3s, transform 0.2s, box-shadow 0.3s",
                }}
                onClick={() => setShowMorePastEvents(!showMorePastEvents)}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "var(--purple-900)";
                  e.currentTarget.style.color = "#fff";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 28px rgba(74,21,114,0.25)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--purple-900)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                >
                  {showMorePastEvents ? "Show Less" : "Load More Events"}
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "0 clamp(20px, 6vw, 72px) clamp(60px, 10vw, 100px)" }}>
        <div
          ref={ctaRef}
          style={{
            background: "linear-gradient(135deg, #ede0f5 0%, #fce7f3 100%)",
            borderRadius: "24px",
            padding: "clamp(40px, 6vw, 72px) clamp(28px, 5vw, 64px)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "28px",
            boxShadow: "0 4px 32px rgba(147,51,234,0.08)",
            border: "1px solid rgba(147,51,234,0.1)",
            opacity: ctaVisible ? 1 : 0,
            transform: ctaVisible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.65s ease, transform 0.65s cubic-bezier(0.22,1,0.36,1)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* BG accent blob */}
          <div style={{
            position: "absolute", top: "-40px", right: "-40px",
            width: "220px", height: "220px",
            background: "radial-gradient(circle, rgba(219,39,119,0.12) 0%, transparent 70%)",
            borderRadius: "50%", pointerEvents: "none",
          }} />

          <div style={{ maxWidth: "520px", position: "relative" }}>
            <h3 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(24px, 3.5vw, 34px)",
              fontWeight: "700",
              color: "var(--purple-900)",
              margin: "0 0 12px",
              lineHeight: 1.2,
            }}>
              Have an idea for our next event?
            </h3>
            <p style={{
              color: "var(--gray-600)",
              fontSize: "15px",
              lineHeight: 1.7,
              margin: 0,
              fontWeight: "300",
            }}>
              We're always looking for fresh perspectives and innovative topics.
              Propose a workshop, guest speaker, or technical session to share with our community.
            </p>
          </div>

          <button
            onClick={() => navigate("/contact")}
            style={{
              background: "linear-gradient(135deg, var(--pink-600) 0%, #c026d3 100%)",
              color: "#fff",
              padding: "15px 36px",
              borderRadius: "12px",
              border: "none",
              fontWeight: "700",
              fontSize: "15px",
              letterSpacing: "0.03em",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: "0 6px 24px rgba(219,39,119,0.35)",
              transition: "transform 0.25s cubic-bezier(0.22,1,0.36,1), box-shadow 0.25s",
              whiteSpace: "nowrap",
              flexShrink: 0,
              position: "relative",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-3px) scale(1.02)";
              e.currentTarget.style.boxShadow = "0 12px 36px rgba(219,39,119,0.42)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = "0 6px 24px rgba(219,39,119,0.35)";
            }}
          >
            Propose an Event →
          </button>
        </div>
      </section>

    </div>
  );
}