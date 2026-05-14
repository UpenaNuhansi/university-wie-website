import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { ArrowLeft, MapPin, Clock, Calendar } from "lucide-react";
import { getEventById } from "../services/eventService";
import Loader from "../components/Loader";

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

export default function EventDetails() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [heroReady, setHeroReady] = useState(false);
  const [contentRef, contentVisible] = useInView();
  const [relatedRef, relatedVisible] = useInView();

  useEffect(() => {
    fetchEventDetails();
    const t = setTimeout(() => setHeroReady(true), 100);
    return () => clearTimeout(t);
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const data = await getEventById(eventId);
      setEvent(data);
      setError(null);
    } catch (err) {
      setError("Event not found or failed to load");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f6eef7" }}>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1f2937", marginBottom: "1rem" }}>{error}</h2>
          <button
            onClick={() => navigate("/events")}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#7c3aed", color: "#fff", padding: "0.6rem 1.4rem", borderRadius: "0.5rem", border: "none", cursor: "pointer", fontWeight: 600 }}
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

  const dateObj = event.date ? (event.date instanceof Date ? event.date : new Date(event.date)) : null;
  const isPast = dateObj && !isNaN(dateObj) && dateObj < new Date();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
        .edet-root { font-family:'DM Sans',sans-serif; background:#f6eef7; }

        /* sticky back bar */
        .edet-back-bar {
          position:sticky; top:0; z-index:20;
          background:rgba(255,255,255,0.9);
          backdrop-filter:blur(14px);
          border-bottom:1px solid rgba(124,58,237,0.08);
          padding:0.875rem 1.5rem;
          transition:box-shadow .3s;
        }
        .edet-back-bar.scrolled { box-shadow:0 2px 16px rgba(80,0,140,0.08); }
        .edet-back-btn {
          display:inline-flex; align-items:center; gap:0.4rem;
          color:#7c3aed; font-weight:600; font-size:0.875rem;
          background:none; border:none; cursor:pointer;
          padding:0; transition:color .2s, gap .2s;
        }
        .edet-back-btn:hover { color:#5b21b6; gap:0.6rem; }

        /* hero */
        .edet-hero {
          position:relative; height:420px; overflow:hidden;
        }
        @media(min-width:768px){ .edet-hero{ height:500px; } }
        .edet-hero-img {
          width:100%; height:100%; object-fit:cover;
          transition:transform 18s ease-in-out;
        }
        .edet-hero-img.ready { transform:scale(1.04); }
        .edet-hero-overlay {
          position:absolute; inset:0;
          background:linear-gradient(to top, rgba(30,0,60,0.55) 0%, transparent 50%);
        }
        .edet-hero-placeholder {
          width:100%; height:100%;
          background:linear-gradient(135deg,#ede9fe 0%,#fce7f3 100%);
          display:flex; align-items:center; justify-content:center;
        }
        .edet-past-badge {
          position:absolute; top:1.25rem; right:1.25rem;
          background:rgba(31,41,55,0.8); backdrop-filter:blur(6px);
          color:#fff; padding:0.35rem 0.9rem; border-radius:999px;
          font-size:0.75rem; font-weight:600; letter-spacing:0.04em;
        }

        /* content */
        .edet-content {
          max-width:52rem; margin:0 auto;
          padding:2.5rem 1.5rem 3rem;
        }
        .edet-title {
          font-family:'Cormorant Garamond',serif;
          font-size:clamp(1.8rem,4vw,3rem);
          font-weight:700; color:#1f2937;
          line-height:1.15; margin-bottom:1.75rem;
        }

        /* info cards */
        .edet-info-grid { display:grid; grid-template-columns:1fr; gap:1rem; margin-bottom:2rem; }
        @media(min-width:640px){ .edet-info-grid{ grid-template-columns:repeat(3,1fr); } }
        .edet-info-card {
          background:#fff; border-radius:1rem; padding:1.1rem 1.25rem;
          box-shadow:0 3px 16px rgba(80,0,140,0.07);
          display:flex; align-items:flex-start; gap:0.85rem;
          transition:transform .28s cubic-bezier(.22,1,.36,1), box-shadow .28s;
        }
        .edet-info-card:hover { transform:translateY(-3px); box-shadow:0 8px 28px rgba(80,0,140,0.11); }
        .edet-info-icon { width:2.6rem; height:2.6rem; border-radius:0.65rem; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .edet-info-label { font-size:0.65rem; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; color:#9ca3af; margin-bottom:0.2rem; }
        .edet-info-val { font-size:0.9375rem; font-weight:600; color:#1f2937; line-height:1.3; }

        /* divider */
        .edet-divider { height:1px; background:linear-gradient(90deg,transparent,rgba(124,58,237,0.2),transparent); margin:2rem 0; }

        /* description */
        .edet-about-h { font-family:'Cormorant Garamond',serif; font-size:1.5rem; font-weight:700; color:#1f2937; margin-bottom:0.75rem; }
        .edet-desc { font-size:0.9375rem; color:#4b5563; line-height:1.8; white-space:pre-wrap; }

        /* CTA buttons */
        .edet-cta { display:flex; flex-wrap:wrap; gap:0.85rem; margin-top:2.5rem; }
        .edet-btn-register {
          background:linear-gradient(90deg,#db2777,#be185d);
          color:#fff; padding:0.75rem 2rem; border-radius:0.55rem;
          font-size:0.9375rem; font-weight:600; border:none; cursor:pointer;
          position:relative; overflow:hidden;
          transition:transform .22s, box-shadow .22s;
          box-shadow:0 4px 18px rgba(219,39,119,0.35);
        }
        .edet-btn-register::after { content:''; position:absolute; inset:0; background:linear-gradient(120deg,transparent 30%,rgba(255,255,255,0.2) 50%,transparent 70%); transform:translateX(-100%); transition:transform .5s ease; }
        .edet-btn-register:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(219,39,119,0.45); }
        .edet-btn-register:hover::after { transform:translateX(100%); }
        .edet-btn-save {
          border:2px solid #7c3aed; color:#7c3aed; padding:0.75rem 2rem;
          border-radius:0.55rem; font-size:0.9375rem; font-weight:600;
          background:transparent; cursor:pointer;
          transition:background .22s, color .22s, transform .22s;
        }
        .edet-btn-save:hover { background:#7c3aed; color:#fff; transform:translateY(-2px); }
        .edet-btn-recap {
          background:none; border:none; cursor:pointer;
          color:#7c3aed; font-weight:600; font-size:0.9375rem;
          padding:0; position:relative; display:inline-block;
        }
        .edet-btn-recap::after { content:''; position:absolute; left:0; bottom:-1px; width:0; height:1.5px; background:#7c3aed; transition:width .25s ease; }
        .edet-btn-recap:hover::after { width:100%; }

        /* related */
        .edet-related { background:#fff; padding:2.5rem 1.5rem; }
        .edet-related-inner { max-width:52rem; margin:0 auto; }
        .edet-related-h { font-family:'Cormorant Garamond',serif; font-size:1.4rem; font-weight:700; color:#1f2937; margin-bottom:0.5rem; }
        .edet-related-p { font-size:0.875rem; color:#6b7280; }
        .edet-related-link { color:#7c3aed; font-weight:600; text-decoration:none; position:relative; }
        .edet-related-link::after { content:''; position:absolute; left:0; bottom:-1px; width:0; height:1px; background:#7c3aed; transition:width .25s; }
        .edet-related-link:hover::after { width:100%; }

        /* fade animations */
        .f-up { opacity:0; transform:translateY(24px); transition:opacity .7s cubic-bezier(.22,1,.36,1), transform .7s cubic-bezier(.22,1,.36,1); }
        .f-up.vis { opacity:1; transform:translateY(0); }
        .fd1{transition-delay:.05s} .fd2{transition-delay:.15s} .fd3{transition-delay:.25s}
        .fd4{transition-delay:.35s} .fd5{transition-delay:.45s}
      `}</style>

      <div className="edet-root">
        {/* Back bar */}
        <div className="edet-back-bar">
          <div style={{ maxWidth: "52rem", margin: "0 auto" }}>
            <button className="edet-back-btn" onClick={() => navigate("/events")}>
              <ArrowLeft size={16} /> Back to Events
            </button>
          </div>
        </div>

        {/* Hero */}
        <div className="edet-hero">
          {event.image ? (
            <img src={event.image} alt={event.title} className={`edet-hero-img ${heroReady ? "ready" : ""}`} />
          ) : (
            <div className="edet-hero-placeholder">
              <svg style={{ width: "7rem", height: "7rem", color: "#c4b5fd" }} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
          )}
          <div className="edet-hero-overlay" />
          {isPast && <div className="edet-past-badge">Past Event</div>}
        </div>

        {/* Content */}
        <div className="edet-content" ref={contentRef}>
          <h1 className={`edet-title f-up fd1 ${contentVisible ? "vis" : ""}`}>{event.title}</h1>

          {/* Info cards */}
          <div className="edet-info-grid">
            {[
              { icon: <Calendar size={20} />, color: "#7c3aed", bg: "rgba(124,58,237,0.1)", label: "Date", val: formatDate(event.date), delay: "fd2" },
              { icon: <Clock size={20} />, color: "#db2777", bg: "rgba(219,39,119,0.1)", label: "Time", val: formatTime(event.date), delay: "fd3" },
              { icon: <MapPin size={20} />, color: "#0d9488", bg: "rgba(13,148,136,0.1)", label: "Location", val: event.location, delay: "fd4" },
            ].map(({ icon, color, bg, label, val, delay }) => (
              <div key={label} className={`edet-info-card f-up ${delay} ${contentVisible ? "vis" : ""}`}>
                <div className="edet-info-icon" style={{ background: bg, color }}>{icon}</div>
                <div>
                  <p className="edet-info-label">{label}</p>
                  <p className="edet-info-val">{val || "—"}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={`edet-divider f-up fd4 ${contentVisible ? "vis" : ""}`} />

          {/* Description */}
          <div className={`f-up fd5 ${contentVisible ? "vis" : ""}`}>
            <h2 className="edet-about-h">About This Event</h2>
            <p className="edet-desc">{event.description}</p>
          </div>

          {/* CTA */}
          <div className={`edet-cta f-up fd5 ${contentVisible ? "vis" : ""}`}>
            {!isPast ? (
              <>
                <button className="edet-btn-register">Register Now</button>
                <button className="edet-btn-save">Save Event</button>
              </>
            ) : (
              <button className="edet-btn-recap">View Recap →</button>
            )}
          </div>
        </div>

        {/* Related */}
        <div className="edet-related" ref={relatedRef}>
          <div className={`edet-related-inner f-up ${relatedVisible ? "vis" : ""}`}>
            <h2 className="edet-related-h">More Events</h2>
            <p className="edet-related-p">
              Check back for more events or explore our{" "}
              <a href="/events" className="edet-related-link">full events list</a>.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}