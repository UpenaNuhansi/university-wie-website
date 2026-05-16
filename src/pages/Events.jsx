import { useEffect, useState, useRef } from "react";
import Loader from "../components/Loader";
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
    --gray-400:   #9ca3af;
    --gray-200:   #e5e7eb;
    --gray-100:   #f3f4f6;
  }

  /* Page entrance animation */
  @keyframes pageEnter {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
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

  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }

  @keyframes blobFloat {
    0%, 100% { transform: scale(1) translate(0, 0); }
    33%       { transform: scale(1.05) translate(8px, -8px); }
    66%       { transform: scale(0.97) translate(-6px, 6px); }
  }

  /* Smooth scroll */
  html { scroll-behavior: smooth; }

  /* Transition for all interactive elements */
  *, *::before, *::after { box-sizing: border-box; }

  /* View Details button base styles */
  .view-details-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    background: transparent;
    color: var(--purple-800);
    padding: 11px 20px;
    border-radius: 10px;
    border: 1.5px solid var(--purple-700);
    font-weight: 600;
    font-size: 13.5px;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    letter-spacing: 0.03em;
    transition: background 0.25s ease, color 0.25s ease, border-color 0.25s ease, transform 0.2s ease, box-shadow 0.25s ease;
  }

  .view-details-btn:hover {
    background: var(--purple-900);
    color: #fff;
    border-color: var(--purple-900);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(74,21,114,0.22);
  }

  /* View Recap link */
  .view-recap-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--pink-600);
    font-weight: 600;
    font-size: 13.5px;
    text-decoration: none;
    border-bottom: 1.5px solid transparent;
    padding-bottom: 1px;
    transition: gap 0.2s, opacity 0.2s, border-color 0.2s;
  }
  .view-recap-link:hover {
    gap: 10px;
    opacity: 0.8;
    border-color: var(--pink-600);
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
    const node = ref.current;

    if (!node) {
      setVisible(true);
      return;
    }

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(node);
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

function formatClockTime(timeValue) {
  if (!timeValue) return "";
  if (typeof timeValue === "string" && /^\d{2}:\d{2}$/.test(timeValue)) {
    const [hours, minutes] = timeValue.split(":").map(Number);
    const d = new Date();
    d.setHours(hours, minutes, 0, 0);
    return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  }
  const d = new Date(timeValue);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
}

function getEventTimeText(event) {
  if (event.startTime && event.endTime) {
    return `${formatClockTime(event.startTime)} - ${formatClockTime(event.endTime)}`;
  }
  if (event.startTime) return formatClockTime(event.startTime);
  if (event.time) return event.time;
  if (event.date) {
    const fallback = formatClockTime(event.date);
    if (fallback) return fallback;
  }
  return "Time TBA";
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
  const isComingSoon = !event.date && (event.comingSoon || event.image);
  const eventDate = event.date ? new Date(event.date) : null;
  const day = eventDate ? eventDate.getDate() : null;
  const month = eventDate ? eventDate.toLocaleDateString("en-US", { month: "short" }) : null;
  const registrationLink = event.registrationLink || event.registerLink;
  const registrationLabel = event.registrationLabel || (event.registrationType === "google" ? "Open Google Form" : "Register Now");
  const eventTimeText = getEventTimeText(event);

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
          : "translateY(36px)",
        opacity: visible ? 1 : 0,
        transition: `
          transform 0.6s cubic-bezier(0.22,1,0.36,1) ${index * 90}ms,
          opacity   0.6s ease ${index * 90}ms,
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
          background: isComingSoon ? "linear-gradient(90deg, var(--pink-600), #c026d3)" : "var(--purple-800)",
          color: "var(--white)",
          borderRadius: "12px",
          padding: isComingSoon ? "8px 12px" : "10px 14px",
          textAlign: "center",
          boxShadow: "0 4px 20px rgba(107,33,168,0.4)",
          animation: visible ? `floatDate 3.5s ease-in-out ${index * 200 + 600}ms infinite` : "none",
          minWidth: "64px",
        }}>
          {isComingSoon ? (
            <div style={{ fontSize: "12px", fontWeight: "700", lineHeight: 1, fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.08em" }}>COMING SOON</div>
          ) : (
            <>
              <div style={{ fontSize: "26px", fontWeight: "700", lineHeight: 1, fontFamily: "'Cormorant Garamond', serif" }}>{day}</div>
              <div style={{ fontSize: "11px", fontWeight: "600", letterSpacing: "0.08em", marginTop: "2px", opacity: 0.9 }}>{month.toUpperCase()}</div>
            </>
          )}
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
          <Meta icon="🕐" text={eventTimeText} />
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

        {registrationLink ? (
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
          /* ── View Details button — outlined style matching the image ── */
          <button
            className="view-details-btn"
            onClick={(e) => { e.stopPropagation(); onClick(); }}
          >
            View Details →
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
        cursor: "pointer",
        boxShadow: hovered
          ? "0 20px 50px rgba(74,21,114,0.14)"
          : "0 2px 16px rgba(74,21,114,0.06)",
        transform: visible
          ? hovered ? "translateY(-5px)" : "translateY(0)"
          : "translateY(32px)",
        opacity: visible ? 1 : 0,
        transition: `
          transform 0.55s cubic-bezier(0.22,1,0.36,1) ${index * 75}ms,
          opacity   0.55s ease ${index * 75}ms,
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

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "14px" }}>
          {event.youtubeLink && (
            <a
              href={event.youtubeLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="view-recap-link"
            >
              ▶ View Recap →
            </a>
          )}
          {event.facebookLink && (
            <a
              href={event.facebookLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="view-recap-link"
              style={{ color: "#1877f2" }}
            >
              f Facebook →
            </a>
          )}
        </div>

        {registrationLink ? (
          <a
            href={registrationLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              background: "linear-gradient(135deg, var(--pink-600) 0%, #c026d3 100%)",
              color: "#fff",
              padding: "10px 16px",
              borderRadius: "10px",
              fontWeight: "600",
              fontSize: "13px",
              textDecoration: "none",
              boxShadow: "0 6px 20px rgba(219,39,119,0.24)",
              transition: "opacity 0.25s, transform 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.transform = "scale(1.03)"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1)"; }}
          >
            {registrationLabel} →
          </a>
        ) : (
          /* ── View Details button — outlined style matching the image ── */
          <button
            className="view-details-btn"
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            style={{ width: "auto", padding: "10px 16px", fontSize: "13px" }}
          >
            View Details →
          </button>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Page Component
───────────────────────────────────────────── */
export default function Events() {
  const [events, setEvents]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [heroReady, setHeroReady] = useState(false);
  const [pageReady, setPageReady] = useState(false);
  const [upcomingRef, upcomingVisible] = useReveal(0.05);
  const [pastRef, pastVisible]         = useReveal(0.05);
  const [ctaRef, ctaVisible]           = useReveal(0.1);
  const [showMorePastEvents, setShowMorePastEvents] = useState(false);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const navigate = useNavigate();

  const getWeekStart = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const groupEventsByWeek = (eventsList) => {
    const weeks = {};
    const comingSoon = [];

    eventsList.forEach(event => {
      if (!event.date) {
        // treat events without a date as "coming soon" (poster)
        comingSoon.push(event);
        return;
      }

      const weekStart = getWeekStart(event.date);
      const weekKey = weekStart.toISOString().split('T')[0];
      if (!weeks[weekKey]) weeks[weekKey] = { start: weekStart, events: [] };
      weeks[weekKey].events.push(event);
    });

    const sorted = Object.values(weeks).sort((a, b) => a.start - b.start);
    // put coming soon bucket first so it's shown as the top 'week'
    if (comingSoon.length) sorted.unshift({ start: null, events: comingSoon });
    return sorted;
  };

  useEffect(() => {
    injectStyles();
    // Trigger page entrance animation
    const t1 = setTimeout(() => setPageReady(true), 50);
    const t2 = setTimeout(() => setHeroReady(true), 100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loader />;

  const now = new Date();
  // Treat events with no date but with an image/poster (or explicit comingSoon flag) as upcoming
  const isComingSoonEvent = (e) => !e.date && (e.comingSoon || e.image);

  const upcoming = events.filter(e => (e.date ? new Date(e.date) > now : isComingSoonEvent(e)));
  const past     = events.filter(e => e.date && new Date(e.date) <= now);
  const upcomingWeeks = groupEventsByWeek(upcoming);
  const currentWeekEvents = upcomingWeeks[currentWeekIndex]?.events || [];

  return (
    <div style={{
      background: "var(--bg-base)",
      fontFamily: "'DM Sans', sans-serif",
      overflowX: "hidden",
      opacity: pageReady ? 1 : 0,
      transform: pageReady ? "translateY(0)" : "translateY(10px)",
      transition: "opacity 0.5s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1)",
    }}>

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
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
          animation: "blobFloat 8s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", bottom: "-40px", right: "-60px",
          width: "300px", height: "300px",
          background: "radial-gradient(circle, rgba(219,39,119,0.1) 0%, transparent 70%)",
          borderRadius: "50%", pointerEvents: "none",
          animation: "blobFloat 10s ease-in-out 1s infinite reverse",
        }} />

        {/*
          ══════════════════════════════════════════════════════════════
          ADD HERO IMAGE HERE
          ──────────────────────────────────────────────────────────────
          To add a background or decorative hero image, uncomment and
          replace the src below. Position it however suits your design.

          Option A — Full background image:
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: "url('/images/your-hero-image.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.12,          ← adjust opacity to taste
              pointerEvents: "none",
            }} />

          Option B — Side illustration / floating graphic:
            <img
              src="/images/your-hero-image.png"
              alt=""
              style={{
                position: "absolute",
                right: "5%",
                bottom: "0",
                height: "80%",
                objectFit: "contain",
                opacity: 0.25,
                pointerEvents: "none",
              }}
            />
          ══════════════════════════════════════════════════════════════
        */}

        {/* Badge */}
        <div style={{
          opacity: heroReady ? 1 : 0,
          transform: heroReady ? "translateY(0)" : "translateY(-12px)",
          transition: "opacity 0.6s ease, transform 0.6s cubic-bezier(0.22,1,0.36,1)",
          marginBottom: "22px",
        }}>
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            background: "rgba(252, 252, 252, 0.95)",
            color: "var(--purple-900)",
            padding: "6px 16px",
            borderRadius: "999px",
            fontSize: "11px",
            fontWeight: "800",
            letterSpacing: "0.14em",
            boxShadow: "0 6px 18px rgba(74,21,114,0.08)",
            border: "1px solid rgba(147,51,234,0.08)",
            backdropFilter: "blur(8px)",
          }}>
            <span style={{
              width: "10px", height: "10px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--pink-600), #c026d3)",
              boxShadow: "0 0 0 4px rgba(219,39,119,0.14)",
              flexShrink: 0,
              animation: "pulse-ring 2.2s ease-out infinite",
            }} />
            <span style={{ lineHeight: 1 }}>EMPOWERING WOMEN IN STEM</span>
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

      {/* ══════════════════════════════════════
          UPCOMING EVENTS
      ══════════════════════════════════════ */}
      <section style={{ padding: "clamp(48px, 8vw, 88px) clamp(20px, 6vw, 72px)" }}>
        <div ref={upcomingRef} style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "clamp(28px, 4vw, 48px)",
          flexWrap: "wrap",
          gap: "12px",
          opacity: upcomingVisible ? 1 : 0,
          transform: upcomingVisible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.6s ease, transform 0.6s cubic-bezier(0.22,1,0.36,1)",
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
                {upcomingWeeks[currentWeekIndex].start
                  ? `Week of ${upcomingWeeks[currentWeekIndex].start.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
                  : 'Coming Soon'}
              </p>
            )}
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            {["←", "→"].map((arrow, i) => {
              const isDisabled = upcomingWeeks.length <= 1 ||
                (arrow === "←" && currentWeekIndex === 0) ||
                (arrow === "→" && currentWeekIndex === upcomingWeeks.length - 1);
              return (
                <button
                  key={i}
                  disabled={isDisabled}
                  onClick={() => {
                    if (arrow === "←") setCurrentWeekIndex(Math.max(0, currentWeekIndex - 1));
                    else setCurrentWeekIndex(Math.min(upcomingWeeks.length - 1, currentWeekIndex + 1));
                  }}
                  style={{
                    width: "42px", height: "42px",
                    borderRadius: "50%",
                    border: "2px solid var(--purple-200)",
                    background: isDisabled ? "var(--gray-100)" : "var(--white)",
                    color: isDisabled ? "var(--gray-400)" : "var(--purple-700)",
                    fontSize: "16px",
                    cursor: isDisabled ? "default" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "background 0.25s, border-color 0.25s, color 0.25s, transform 0.2s, box-shadow 0.25s",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                  onMouseEnter={e => {
                    if (!isDisabled) {
                      e.currentTarget.style.background = "var(--purple-900)";
                      e.currentTarget.style.color = "#fff";
                      e.currentTarget.style.borderColor = "var(--purple-900)";
                      e.currentTarget.style.transform = "scale(1.1)";
                      e.currentTarget.style.boxShadow = "0 4px 16px rgba(74,21,114,0.2)";
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isDisabled) {
                      e.currentTarget.style.background = "var(--white)";
                      e.currentTarget.style.color = "var(--purple-700)";
                      e.currentTarget.style.borderColor = "var(--purple-200)";
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = "none";
                    }
                  }}
                >{arrow}</button>
              );
            })}
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

      {/* ══════════════════════════════════════
          PAST EVENTS
      ══════════════════════════════════════ */}
      <section style={{ padding: "clamp(48px, 8vw, 88px) clamp(20px, 6vw, 72px)" }}>
        <div ref={pastRef} style={{
          marginBottom: "clamp(28px, 4vw, 48px)",
          opacity: pastVisible ? 1 : 0,
          transform: pastVisible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.6s ease, transform 0.6s cubic-bezier(0.22,1,0.36,1)",
        }}>
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

            {past.length > 4 && (
              <div style={{ display: "flex", justifyContent: "center", marginTop: "clamp(36px, 5vw, 56px)" }}>
                <button
                  onClick={() => setShowMorePastEvents(!showMorePastEvents)}
                  style={{
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

      {/* Divider */}
      <div style={{
        margin: "0 clamp(20px, 6vw, 72px)",
        height: "1px",
        background: "linear-gradient(90deg, transparent, var(--purple-200), transparent)",
      }} />

      {/* ══════════════════════════════════════
          PROPOSE AN IDEA / CTA SECTION
          (matches the "Have an idea?" section
          shown in the design image)
      ══════════════════════════════════════ */}
      <section style={{ padding: "clamp(48px, 8vw, 88px) clamp(20px, 6vw, 72px)" }}>
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
            transform: ctaVisible ? "translateY(0)" : "translateY(28px)",
            transition: "opacity 0.7s ease, transform 0.7s cubic-bezier(0.22,1,0.36,1)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* BG accent blobs */}
          <div style={{
            position: "absolute", top: "-40px", right: "-40px",
            width: "220px", height: "220px",
            background: "radial-gradient(circle, rgba(219,39,119,0.12) 0%, transparent 70%)",
            borderRadius: "50%", pointerEvents: "none",
            animation: "blobFloat 9s ease-in-out infinite",
          }} />
          <div style={{
            position: "absolute", bottom: "-30px", left: "30%",
            width: "160px", height: "160px",
            background: "radial-gradient(circle, rgba(147,51,234,0.08) 0%, transparent 70%)",
            borderRadius: "50%", pointerEvents: "none",
            animation: "blobFloat 7s ease-in-out 2s infinite reverse",
          }} />

          {/* Text content */}
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

          {/* CTA Button */}
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
              transition: "transform 0.25s cubic-bezier(0.22,1,0.36,1), box-shadow 0.25s, opacity 0.2s",
              whiteSpace: "nowrap",
              flexShrink: 0,
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
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
            <a href="/contact">Propose an Event</a>
            {/* lightbulb icon */}
            <span style={{ fontSize: "18px", lineHeight: 1 }}>💡</span>
          </button>
        </div>
      </section>

    </div>
  );
}