import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { ArrowLeft, MapPin, Clock, Calendar, Play } from "lucide-react";
import { getEventById } from "../services/eventService";
import Loader from "../components/Loader";

/* ─────────────────────────────────────────────
   Global styles – mirrors your Events page tokens
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

  @keyframes heroScale {
    from { transform: scale(1.08); opacity: 0; }
    to   { transform: scale(1.04); opacity: 1; }
  }

  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  @keyframes shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position: 600px 0; }
  }

  @keyframes pulse-ring {
    0%   { box-shadow: 0 0 0 0   rgba(147,51,234,0.28); }
    70%  { box-shadow: 0 0 0 10px rgba(147,51,234,0); }
    100% { box-shadow: 0 0 0 0   rgba(147,51,234,0); }
  }

  @keyframes gradientShift {
    0%,100% { background-position: 0% 50%; }
    50%      { background-position: 100% 50%; }
  }

  @keyframes badgePop {
    0%   { transform: scale(0.7) translateY(-6px); opacity: 0; }
    70%  { transform: scale(1.05) translateY(0); opacity: 1; }
    100% { transform: scale(1) translateY(0); opacity: 1; }
  }
`;

function injectStyles() {
  if (document.getElementById("eventdetails-global-style")) return;
  const el = document.createElement("style");
  el.id = "eventdetails-global-style";
  el.textContent = GLOBAL_STYLE;
  document.head.appendChild(el);
}

/* ─────────────────────────────────────────────
   Intersection-observer hook for scroll reveals
───────────────────────────────────────────── */
function useReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
      },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

export default function EventDetails() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent]       = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [heroReady, setHeroReady] = useState(false);
  const [contentRef, contentVisible] = useReveal(0.1);
  const [relatedRef, relatedVisible] = useReveal(0.1);

  useEffect(() => {
    injectStyles();
    fetchEventDetails();
    const t = setTimeout(() => setHeroReady(true), 60);
    return () => clearTimeout(t);
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const data = await getEventById(eventId);
      setEvent(data);
      setError(null);
    } catch {
      setError("Event not found or failed to load");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div style={{
        minHeight: "60vh", display: "flex", alignItems: "center",
        justifyContent: "center", background: "var(--bg-base)",
        fontFamily: "'DM Sans', sans-serif",
        animation: "fadeIn 0.4s ease",
      }}>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--purple-900)", marginBottom: "1rem" }}>
            {error}
          </h2>
          <button
            onClick={() => navigate("/events")}
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              background: "var(--purple-700)", color: "#fff",
              padding: "0.65rem 1.5rem", borderRadius: "0.6rem",
              border: "none", cursor: "pointer", fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(126,34,206,0.3)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
          >
            <ArrowLeft size={16} /> Back to Events
          </button>
        </div>
      </div>
    );
  }

  if (!event) return null;

  const formatDate = (date) => {
    if (!date) return "";
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d)) return "Invalid Date";
    return d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  };

  const formatTime = (date) => {
    if (!date) return "";
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d)) return "Invalid Time";
    return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  const dateObj   = event.date ? (event.date instanceof Date ? event.date : new Date(event.date)) : null;
  const isPast    = dateObj && !isNaN(dateObj) && dateObj < new Date();
  const registrationEnabled = event.registrationEnabled ?? event.allowRegister;
  const registrationLink = event.registrationLink || event.registerLink;
  const registrationLabel = event.registrationLabel || (event.registrationType === "google" ? "Open Google Form" : "Register Now");

  const infoCards = [
    { icon: <Calendar size={20} />, label: "Date",     val: formatDate(event.date), delay: "0.12s", bg: "rgba(147,51,234,0.06)" },
    { icon: <Clock    size={20} />, label: "Time",     val: formatTime(event.date), delay: "0.22s", bg: "rgba(219,39,119,0.05)" },
    { icon: <MapPin   size={20} />, label: "Location", val: event.location,         delay: "0.32s", bg: "rgba(147,51,234,0.06)" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; }

        .edet-root {
          font-family: 'DM Sans', sans-serif;
          background: var(--bg-base);
          overflow-x: hidden;
          min-height: 100vh;
        }

        /* ── Back bar ── */
        .edet-back-bar {
          padding: 1.1rem 28px;
          background: rgba(255,255,255,0.88);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(147,51,234,0.10);
          position: sticky;
          top: 0;
          z-index: 50;
          animation: fadeIn 0.35s ease;
        }

        .edet-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          color: var(--purple-700);
          font-weight: 600;
          font-size: 0.9rem;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.35rem 0.75rem 0.35rem 0.5rem;
          border-radius: 8px;
          transition: background 0.2s ease, color 0.2s ease, gap 0.25s ease;
          letter-spacing: 0.01em;
        }

        .edet-back-btn:hover {
          background: var(--purple-100);
          color: var(--purple-900);
          gap: 0.7rem;
        }

        /* ── Hero ── */
        .edet-hero {
          position: relative;
          width: 100%;
          height: clamp(300px, 48vw, 520px);
          overflow: hidden;
          background: linear-gradient(135deg, #ede0f5 0%, var(--bg-base) 100%);
        }

        .edet-hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          animation: heroScale 1.1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          will-change: transform, opacity;
        }

        .edet-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(45,10,78,0.08) 0%,
            rgba(45,10,78,0.22) 60%,
            rgba(45,10,78,0.55) 100%
          );
          animation: fadeIn 0.8s ease 0.2s both;
        }

        .edet-hero-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #ede0f5 0%, var(--bg-base) 100%);
        }

        .edet-hero-placeholder-icon {
          color: #d8c4fc;
          animation: fadeIn 0.6s ease 0.3s both;
        }

        /* Floating title inside hero (when image exists) */
        .edet-hero-title-wrap {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: clamp(24px, 4vw, 48px) clamp(24px, 6vw, 80px);
          animation: fadeSlideUp 0.75s cubic-bezier(0.22, 1, 0.36, 1) 0.35s both;
        }

        .edet-hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(26px, 4.5vw, 52px);
          font-weight: 700;
          color: #fff;
          margin: 0;
          line-height: 1.12;
          letter-spacing: -0.02em;
          text-shadow: 0 2px 20px rgba(45,10,78,0.5);
        }

        /* Past badge */
        .edet-past-badge {
          position: absolute;
          top: 1.25rem;
          right: 1.25rem;
          background: rgba(45,10,78,0.82);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          color: #fff;
          padding: 0.45rem 1rem;
          border-radius: 999px;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          box-shadow: 0 4px 16px rgba(45,10,78,0.3);
          animation: badgePop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) 0.6s both;
          text-transform: uppercase;
        }

        /* ── Content ── */
        .edet-content {
          max-width: 840px;
          margin: 0 auto;
          padding: clamp(36px, 5vw, 72px) clamp(20px, 6vw, 72px);
        }

        /* Title (shown outside hero when no image) */
        .edet-content-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(28px, 4vw, 44px);
          font-weight: 700;
          color: var(--purple-900);
          margin: 0 0 32px;
          line-height: 1.14;
          letter-spacing: -0.015em;
        }

        /* ── Info cards ── */
        .edet-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: clamp(14px, 2vw, 20px);
          margin-bottom: 36px;
        }

        .edet-info-card {
          background: var(--white);
          border-radius: 18px;
          padding: 20px 22px;
          box-shadow: 0 2px 16px rgba(74,21,114,0.06);
          display: flex;
          align-items: flex-start;
          gap: 14px;
          border: 1px solid rgba(147,51,234,0.07);
          transition:
            transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.35s cubic-bezier(0.22, 1, 0.36, 1);
          cursor: default;
          will-change: transform;
        }

        .edet-info-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 14px 40px rgba(74,21,114,0.13);
        }

        .edet-info-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: var(--purple-700);
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .edet-info-card:hover .edet-info-icon {
          transform: scale(1.15) rotate(-4deg);
        }

        .edet-info-label {
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--gray-500);
          margin: 0 0 5px;
        }

        .edet-info-val {
          font-size: 0.92rem;
          font-weight: 600;
          color: var(--gray-600);
          line-height: 1.45;
          margin: 0;
        }

        /* ── Divider ── */
        .edet-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--purple-200) 30%, var(--purple-200) 70%, transparent);
          margin: 36px 0;
          border: none;
        }

        /* ── About section ── */
        .edet-about-h {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(20px, 3vw, 28px);
          font-weight: 700;
          color: var(--purple-900);
          margin: 0 0 14px;
          line-height: 1.15;
        }

        .edet-desc {
          font-size: 0.95rem;
          color: var(--gray-600);
          line-height: 1.85;
          white-space: pre-wrap;
          margin: 0 0 8px;
        }

        /* ── CTA buttons ── */
        .edet-cta {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          margin-top: 36px;
        }

        .edet-btn-register {
          background: linear-gradient(135deg, var(--pink-600) 0%, #c026d3 100%);
          background-size: 200% 200%;
          color: #fff;
          padding: 14px 34px;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          box-shadow: 0 4px 20px rgba(219,39,119,0.32);
          transition:
            transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.3s ease,
            background-position 0.4s ease;
          will-change: transform;
        }

        .edet-btn-register:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 10px 32px rgba(219,39,119,0.46);
          background-position: right center;
        }

        .edet-btn-register:active {
          transform: translateY(-1px) scale(1.01);
        }

        .edet-btn-save {
          border: 2px solid var(--purple-900);
          color: var(--purple-900);
          background: transparent;
          padding: 14px 34px;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition:
            background 0.28s ease,
            color 0.28s ease,
            transform 0.28s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.28s ease;
          will-change: transform;
        }

        .edet-btn-save:hover {
          background: var(--purple-900);
          color: #fff;
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 10px 28px rgba(74,21,114,0.22);
        }

        .edet-btn-save:active {
          transform: translateY(-1px) scale(1.01);
        }

        .edet-btn-recap {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, var(--purple-900) 0%, var(--pink-600) 100%);
          color: #fff;
          border: none;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.9rem;
          padding: 14px 28px;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.03em;
          box-shadow: 0 4px 20px rgba(74,21,114,0.2);
          text-decoration: none;
          transition:
            transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.3s ease,
            gap 0.25s ease;
          will-change: transform;
        }

        .edet-btn-recap:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 10px 30px rgba(74,21,114,0.32);
          gap: 14px;
        }

        /* ── Related section ── */
        .edet-related {
          background: var(--white);
          padding: clamp(40px, 6vw, 80px) clamp(20px, 6vw, 72px);
          border-top: 1px solid rgba(147,51,234,0.08);
          position: relative;
          overflow: hidden;
        }

        .edet-related::before {
          content: '';
          position: absolute;
          top: -80px;
          right: -80px;
          width: 280px;
          height: 280px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(147,51,234,0.06) 0%, transparent 70%);
          pointer-events: none;
        }

        .edet-related-inner {
          max-width: 840px;
          margin: 0 auto;
          position: relative;
        }

        .edet-related-h {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(22px, 3.5vw, 32px);
          font-weight: 700;
          color: var(--purple-900);
          margin: 0 0 12px;
          line-height: 1.2;
        }

        .edet-related-p {
          font-size: 0.95rem;
          color: var(--gray-600);
          line-height: 1.75;
          margin: 0;
        }

        .edet-related-link {
          color: var(--pink-600);
          font-weight: 600;
          text-decoration: none;
          position: relative;
        }

        .edet-related-link::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -1.5px;
          width: 0%;
          height: 1.5px;
          background: var(--pink-600);
          transition: width 0.28s cubic-bezier(0.22, 1, 0.36, 1);
          border-radius: 2px;
        }

        .edet-related-link:hover::after { width: 100%; }

        /* ── Scroll reveal ── */
        .f-up {
          opacity: 0;
          transform: translateY(24px);
          transition:
            opacity  0.65s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .f-up.vis {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      <div className="edet-root">

        {/* ── Sticky Back Bar ── */}
        <div className="edet-back-bar">
          <button className="edet-back-btn" onClick={() => navigate("/events")}>
            <ArrowLeft size={17} /> Back to Events
          </button>
        </div>

        {/* ── Hero ── */}
        <div className="edet-hero">
          {event.image ? (
            <>
              <img
                src={event.image}
                alt={event.title}
                className="edet-hero-img"
              />
              <div className="edet-hero-overlay" />
              {/* Title overlaid on hero image */}
              <div className="edet-hero-title-wrap">
                <h1 className="edet-hero-title">{event.title}</h1>
              </div>
            </>
          ) : (
            <div className="edet-hero-placeholder">
              <svg
                className="edet-hero-placeholder-icon"
                style={{ width: "6rem", height: "6rem" }}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {isPast && <span className="edet-past-badge">Past Event</span>}
        </div>

        {/* ── Main Content ── */}
        <div className="edet-content" ref={contentRef}>

          {/* Title only when no hero image */}
          {!event.image && (
            <h1
              className={`edet-content-title f-up ${contentVisible ? "vis" : ""}`}
              style={{ transitionDelay: "0.04s" }}
            >
              {event.title}
            </h1>
          )}

          {/* Info cards */}
          <div className="edet-info-grid">
            {infoCards.map(({ icon, label, val, delay, bg }) => (
              <div
                key={label}
                className={`edet-info-card f-up ${contentVisible ? "vis" : ""}`}
                style={{ transitionDelay: delay }}
              >
                <div className="edet-info-icon" style={{ background: bg }}>
                  {icon}
                </div>
                <div>
                  <p className="edet-info-label">{label}</p>
                  <p className="edet-info-val">{val || "—"}</p>
                </div>
              </div>
            ))}
          </div>

          <hr
            className={`edet-divider f-up ${contentVisible ? "vis" : ""}`}
            style={{ transitionDelay: "0.38s" }}
          />

          {/* Description */}
          <div
            className={`f-up ${contentVisible ? "vis" : ""}`}
            style={{ transitionDelay: "0.44s" }}
          >
            <h2 className="edet-about-h">About This Event</h2>
            <p className="edet-desc">{event.description}</p>
          </div>

          {/* CTA */}
          <div
            className={`edet-cta f-up ${contentVisible ? "vis" : ""}`}
            style={{ transitionDelay: "0.52s" }}
          >
            {!isPast && registrationEnabled && registrationLink ? (
              <a
                href={registrationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="edet-btn-register"
                style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
              >
                {registrationLabel} →
              </a>
            ) : !isPast ? (
              <button className="edet-btn-save">Registration Closed</button>
            ) : (
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                {event.youtubeLink && (
                  <a
                    href={event.youtubeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="edet-btn-recap"
                    style={{ background: "linear-gradient(135deg, #ff0000 0%, #cc0000 100%)" }}
                  >
                    <Play size={16} fill="currentColor" /> Watch on YouTube
                  </a>
                )}
                {event.facebookLink && (
                  <a
                    href={event.facebookLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="edet-btn-recap"
                    style={{ background: "linear-gradient(135deg, #1877f2 0%, #0a66c2 100%)" }}
                  >
                    <svg style={{ width: "16px", height: "16px", fill: "currentColor" }} viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Watch on Facebook
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Related / Footer section ── */}
        <div className="edet-related" ref={relatedRef}>
          <div
            className={`edet-related-inner f-up ${relatedVisible ? "vis" : ""}`}
            style={{ transitionDelay: "0.08s" }}
          >
            <h2 className="edet-related-h">More Events</h2>
            <p className="edet-related-p">
              Explore our{" "}
              <a href="/events" className="edet-related-link">full events list</a>
              {" "}and discover upcoming experiences.
            </p>
          </div>
        </div>

      </div>
    </>
  );
}