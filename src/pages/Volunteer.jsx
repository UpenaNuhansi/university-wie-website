import React, { useEffect, useRef, useState } from "react";
import heroBg from "../assets/volunteer/heroBg.jpg"
import volunteersIllustration from "../assets/volunteer/illustration.jpeg";

// ── IMAGE IMPORTS ──────────────────────────────────────────────
// 🖼️ Hero background image (group photo of volunteers in purple shirts)
// import heroBg from "../assets/volunteer/hero-bg.jpg";

// 🖼️ Bottom illustration inside "Why Volunteer" card
//    (illustrated women standing in front of university building)
// import volunteersIllustration from "../assets/volunteer/illustration.png";
// ──────────────────────────────────────────────────────────────

/* ── tiny intersection-observer hook ── */
function useInView(threshold = 0.12) {
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

/* ── reasons list ── */
const reasons = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
      </svg>
    ),
    color: "#db2777",
    bg: "rgba(219,39,119,0.10)",
    title: "Gain Experience",
    desc: "Develop leadership, event management, and technical skills in a supportive, real-world environment.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    color: "#7c3aed",
    bg: "rgba(124,58,237,0.10)",
    title: "Networking",
    desc: "Connect with industry professionals, academic leaders, and like-minded peers across the university.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
    color: "#db2777",
    bg: "rgba(219,39,119,0.10)",
    title: "Community Impact",
    desc: "Play a direct role in empowering women in STEM and fostering a more inclusive tech community.",
  },
];

const Volunteer = () => {
  /* hero stagger */
  const [heroReady, setHeroReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setHeroReady(true), 120); return () => clearTimeout(t); }, []);

  /* section refs */
  const [leftRef,  leftVisible]  = useInView();
  const [rightRef, rightVisible] = useInView();

  /* form state */
  const [form, setForm] = useState({ name: "", email: "", dept: "", skills: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1200);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .vol-root { font-family: 'DM Sans', sans-serif; background: #f5f3ff; width: 100%; }

        /* ── HERO ── */
        .vol-hero {
          position: relative;
          min-height: 420px;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
          border-radius: 0 0 1.5rem 1.5rem;
          margin: 0 1rem 0;
        }
        @media (min-width: 768px) { .vol-hero { margin: 0 2rem 0; min-height: 460px; } }
        @media (min-width: 1024px) { .vol-hero { margin: 0 3rem 0; } }

        .vol-hero-img {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          object-position: center top;
          /* 🖼️ Replace background-color with the actual <img> tag once you add heroBg */
          background: linear-gradient(135deg, #4c1d95 0%, #1e1b4b 40%, #6d28d9 100%);
          animation: kenburns-vol 18s ease-in-out infinite alternate;
        }
        @keyframes kenburns-vol {
          from { transform: scale(1); }
          to   { transform: scale(1.06); }
        }

        .vol-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to right,
            rgba(0,0,0,0.65) 0%,
            rgba(30,0,60,0.45) 55%,
            rgba(0,0,0,0.15) 100%);
        }

        .vol-hero-content {
          position: relative; z-index: 2;
          padding: 3rem 2rem 2.5rem;
          max-width: 600px;
        }
        @media (min-width: 768px) { .vol-hero-content { padding: 3.5rem 3rem 3rem; } }

        .vol-hero-tag {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 999px;
          padding: 0.3rem 0.9rem;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #fff;
          margin-bottom: 1.1rem;
        }
        .vol-hero-tag-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #f472b6;
          animation: blink 1.8s ease-in-out infinite;
        }
        @keyframes blink { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.5)} }

        .vol-hero-h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 700;
          color: #fff;
          line-height: 1.15;
          margin-bottom: 0.85rem;
        }
        .vol-hero-p {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.82);
          line-height: 1.65;
          margin-bottom: 1.75rem;
          max-width: 440px;
        }

        /* apply now button */
        .btn-apply {
          display: inline-block;
          background: #db2777;
          color: #fff;
          padding: 0.7rem 1.8rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          text-decoration: none;
          border: none; cursor: pointer;
          position: relative; overflow: hidden;
          transition: transform 0.22s, box-shadow 0.22s;
          box-shadow: 0 4px 18px rgba(219,39,119,0.45);
        }
        .btn-apply::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.22) 50%, transparent 70%);
          transform: translateX(-100%);
          transition: transform 0.5s ease;
        }
        .btn-apply:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(219,39,119,0.55); }
        .btn-apply:hover::after { transform: translateX(100%); }

        /* ── fade-up helpers ── */
        .f-up {
          opacity: 0; transform: translateY(28px);
          transition: opacity 0.72s cubic-bezier(.22,1,.36,1), transform 0.72s cubic-bezier(.22,1,.36,1);
        }
        .f-left {
          opacity: 0; transform: translateX(-32px);
          transition: opacity 0.72s cubic-bezier(.22,1,.36,1), transform 0.72s cubic-bezier(.22,1,.36,1);
        }
        .f-right {
          opacity: 0; transform: translateX(32px);
          transition: opacity 0.72s cubic-bezier(.22,1,.36,1), transform 0.72s cubic-bezier(.22,1,.36,1);
        }
        .f-up.vis, .f-left.vis, .f-right.vis { opacity: 1; transform: none; }
        .fd1{transition-delay:.05s} .fd2{transition-delay:.18s} .fd3{transition-delay:.30s}
        .fd4{transition-delay:.42s} .fd5{transition-delay:.54s}

        /* hero specific stagger — driven by heroReady */
        .h-tag  { opacity:0; transform:translateY(16px); transition: opacity .5s ease .1s, transform .5s ease .1s; }
        .h-h1   { opacity:0; transform:translateY(20px); transition: opacity .6s ease .25s, transform .6s ease .25s; }
        .h-p    { opacity:0; transform:translateY(20px); transition: opacity .6s ease .4s,  transform .6s ease .4s; }
        .h-btn  { opacity:0; transform:translateY(20px); transition: opacity .6s ease .55s, transform .6s ease .55s; }
        .hero-ready .h-tag,
        .hero-ready .h-h1,
        .hero-ready .h-p,
        .hero-ready .h-btn { opacity:1; transform:translateY(0); }

        /* ── MAIN SECTION ── */
        .vol-main {
          max-width: 1100px;
          margin: 2.5rem auto;
          padding: 0 1rem;
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 768px) {
          .vol-main { grid-template-columns: 1fr 1.6fr; gap: 2rem; padding: 0 2rem; }
        }
        @media (min-width: 1024px) { .vol-main { padding: 0 3rem; } }

        /* ── WHY VOLUNTEER CARD ── */
        .why-card {
          background: #fff;
          border-radius: 1.25rem;
          padding: 2rem 1.75rem;
          box-shadow: 0 4px 28px rgba(80,0,140,0.08);
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .why-h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem;
          font-weight: 700;
          color: #4c1d95;
          margin-bottom: 1.5rem;
          line-height: 1.2;
        }

        .reason-item {
          display: flex; align-items: flex-start; gap: 1rem;
          padding: 1.1rem 0;
          border-bottom: 1px solid rgba(124,58,237,0.07);
          transition: background 0.22s;
          border-radius: 0.5rem;
          padding-left: 0.25rem;
        }
        .reason-item:last-of-type { border-bottom: none; }
        .reason-item:hover { background: rgba(245,243,255,0.7); }

        .reason-icon {
          width: 2.6rem; height: 2.6rem; border-radius: 0.65rem;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: transform 0.3s cubic-bezier(.22,1,.36,1);
        }
        .reason-item:hover .reason-icon { transform: scale(1.12) rotate(-3deg); }

        .reason-title {
          font-weight: 600; font-size: 1rem;
          color: #1f2937;
          margin-bottom: 0.3rem;
        }
        .reason-desc {
          font-size: 0.845rem; color: #6b7280; line-height: 1.6;
        }

        /* illustration area */
        .illustration-wrap {
          margin-top: 1.5rem;
          border-radius: 0.85rem;
          overflow: hidden;
          min-height: 180px;
          background: linear-gradient(135deg, #ede9fe 0%, #fce7f3 100%);
          display: flex; align-items: center; justify-content: center;
          position: relative;
        }
        .illustration-wrap img {
          width: 100%; height: 100%; object-fit: cover;
        }
        /* placeholder shown until image is added */
        .illustration-placeholder {
          display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
          color: #a78bfa; font-size: 0.75rem; text-align: center; padding: 1.5rem;
        }

        /* ── FORM CARD ── */
        .form-card {
          background: #fff;
          border-radius: 1.25rem;
          padding: 2rem 1.75rem 2.25rem;
          box-shadow: 0 4px 28px rgba(80,0,140,0.08);
        }

        .form-h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.9rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.4rem;
        }
        .form-sub {
          font-size: 0.845rem; color: #6b7280;
          line-height: 1.55; margin-bottom: 1.75rem;
        }

        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        @media (max-width: 540px) { .form-grid-2 { grid-template-columns: 1fr; } }

        .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
        .form-group-full { margin-bottom: 1rem; display: flex; flex-direction: column; gap: 0.4rem; }

        .form-label {
          font-size: 0.8125rem; font-weight: 500; color: #374151;
        }

        .form-input, .form-textarea {
          width: 100%;
          padding: 0.65rem 0.9rem;
          border: 1.5px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-family: 'DM Sans', sans-serif;
          color: #1f2937;
          background: #fafafa;
          transition: border-color 0.22s, box-shadow 0.22s, background 0.22s;
          outline: none;
        }
        .form-input::placeholder, .form-textarea::placeholder { color: #9ca3af; }
        .form-input:focus, .form-textarea:focus {
          border-color: #7c3aed;
          box-shadow: 0 0 0 3px rgba(124,58,237,0.12);
          background: #fff;
        }
        .form-textarea { resize: vertical; min-height: 110px; }

        /* submit button */
        .btn-submit {
          width: 100%;
          padding: 0.85rem 1.5rem;
          background: linear-gradient(90deg, #db2777 0%, #be185d 100%);
          color: #fff;
          font-size: 0.9375rem;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          border: none; border-radius: 0.55rem;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          margin-top: 1.25rem;
          position: relative; overflow: hidden;
          transition: transform 0.22s, box-shadow 0.22s, opacity 0.22s;
          box-shadow: 0 4px 18px rgba(219,39,119,0.38);
        }
        .btn-submit::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%);
          transform: translateX(-100%);
          transition: transform 0.5s ease;
        }
        .btn-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(219,39,119,0.48); }
        .btn-submit:hover::after { transform: translateX(100%); }
        .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }

        /* loading spinner */
        .spinner {
          width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff; border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* success state */
        .success-box {
          text-align: center; padding: 2.5rem 1.5rem;
          animation: pop-in 0.5s cubic-bezier(.22,1,.36,1);
        }
        @keyframes pop-in {
          from { opacity:0; transform: scale(0.88); }
          to   { opacity:1; transform: scale(1); }
        }
        .success-icon {
          width: 3.5rem; height: 3.5rem; border-radius: 50%;
          background: linear-gradient(135deg, #db2777, #7c3aed);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1rem;
          box-shadow: 0 6px 24px rgba(219,39,119,0.35);
        }
        .success-h { font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; font-weight: 700; color: #4c1d95; margin-bottom: 0.5rem; }
        .success-p { font-size: 0.875rem; color: #6b7280; line-height: 1.6; }
      `}</style>

      <div className="vol-root">

        {/* ══════════════ HERO ══════════════ */}
        <div style={{ background: "#f5f3ff", paddingTop: "1.5rem", paddingBottom: "0" }}>
          <section className={`vol-hero ${heroReady ? "hero-ready" : ""}`}>

            
            {/* <div className="vol-hero-img" aria-hidden="true" /> */}
            <img src={heroBg} alt="volunteers" className="vol-hero-img" />

            <div className="vol-hero-overlay" />

            <div className="vol-hero-content">
              <span className="vol-hero-tag h-tag">
                <span className="vol-hero-tag-dot" />
                Join the Team
              </span>

              <h1 className="vol-hero-h1 h-h1">
                Become an Event Volunteer
              </h1>

              <p className="vol-hero-p h-p">
                Empower your peers, build your skills, and help us create unforgettable
                experiences for women in STEM at Sabaragamuwa University.
              </p>

              <button
                className="btn-apply h-btn"
                onClick={() => document.getElementById("vol-form").scrollIntoView({ behavior: "smooth" })}
              >
                Apply Now
              </button>
            </div>
          </section>
        </div>

        {/* ══════════════ MAIN GRID ══════════════ */}
        <div className="vol-main">

          {/* ── LEFT: Why Volunteer ── */}
          <div ref={leftRef} className={`why-card f-left fd1 ${leftVisible ? "vis" : ""}`}>

            <h2 className="why-h2">Why Volunteer with Us?</h2>

            {reasons.map(({ icon, color, bg, title, desc }, i) => (
              <div
                key={title}
                className={`reason-item f-up fd${i + 2} ${leftVisible ? "vis" : ""}`}
              >
                <div className="reason-icon" style={{ background: bg, color }}>
                  {icon}
                </div>
                <div>
                  <p className="reason-title">{title}</p>
                  <p className="reason-desc">{desc}</p>
                </div>
              </div>
            ))}

            
            <div className="illustration-wrap" style={{ marginTop: "1.5rem" }}>
              <img src={volunteersIllustration} alt="volunteers illustration" />
              {/* <div className="illustration-placeholder">
                <div className="illustration-wrap">
                  <img src={volunteersIllustration} alt="volunteers illustration" />
                </div>
              </div> */}
            </div>
          </div>

          {/* ── RIGHT: Application Form ── */}
          <div
            id="vol-form"
            ref={rightRef}
            className={`form-card f-right fd1 ${rightVisible ? "vis" : ""}`}
          >
            {submitted ? (
              <div className="success-box">
                <div className="success-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h3 className="success-h">Application Submitted!</h3>
                <p className="success-p">
                  Thank you for your interest in volunteering with IEEE WIE SUSL.<br />
                  We'll be in touch with you shortly.
                </p>
              </div>
            ) : (
              <>
                <h2 className="form-h2">Volunteer Application</h2>
                <p className="form-sub">
                  Fill out the form below to express your interest in joining our volunteer pool for upcoming events.
                </p>

                <form onSubmit={handleSubmit} noValidate>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label" htmlFor="name">Full Name</label>
                      <input
                        id="name" name="name" type="text"
                        className="form-input"
                        placeholder="Jane Doe"
                        value={form.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="email">University Email</label>
                      <input
                        id="email" name="email" type="email"
                        className="form-input"
                        placeholder="jane@std.susl.lk"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group-full">
                    <label className="form-label" htmlFor="dept">Department & Batch</label>
                    <input
                      id="dept" name="dept" type="text"
                      className="form-input"
                      placeholder="Computing & Information Systems, 18/19"
                      value={form.dept}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group-full">
                    <label className="form-label" htmlFor="skills">Skills you can offer</label>
                    <textarea
                      id="skills" name="skills"
                      className="form-textarea"
                      placeholder="E.g., Graphic Design, Public Speaking, Logistics Coordination..."
                      value={form.skills}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button type="submit" className="btn-submit" disabled={loading}>
                    {loading ? (
                      <><span className="spinner" /> Submitting…</>
                    ) : (
                      <>Submit Application →</>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

      </div>
    </>
  );
};

export default Volunteer;