// src/pages/Contact.jsx
import React, { useEffect, useRef, useState } from "react";
import contactHeroBg from "../assets/contact/hero-bg.jpg";        // optional hero image
import { submitContactMessage } from "../services/contactService";

// Intersection Observer hook (same as volunteer)
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

const Contact = () => {
  // Hero stagger animation
  const [heroReady, setHeroReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setHeroReady(true), 120);
    return () => clearTimeout(t);
  }, []);

  // Section animation refs
  const [leftRef, leftVisible] = useInView();
  const [rightRef, rightVisible] = useInView();

  // Form state
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!form.name.trim()) {
      setError("Full name is required");
      return;
    }
    if (!form.email.trim()) {
      setError("Email address is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!form.subject.trim()) {
      setError("Subject is required");
      return;
    }
    if (!form.message.trim()) {
      setError("Message cannot be empty");
      return;
    }

    try {
      setLoading(true);
      await submitContactMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
      });
      setForm({ name: "", email: "", subject: "", message: "" });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 6000);
    } catch (err) {
      console.error("Error submitting contact form:", err);
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Social icons (SVG)
  const socialIcons = {
    facebook: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>,
    instagram: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>,
    linkedin: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>,
    email: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,4 12,13 2,4"/></svg>,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .contact-root { font-family: 'DM Sans', sans-serif; background: #f5f3ff; width: 100%; }

        /* ── HERO (same as volunteer) ── */
        .contact-hero {
          position: relative;
          min-height: 380px;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
          border-radius: 0 0 1.5rem 1.5rem;
          margin: 0 1rem 0;
        }
        @media (min-width: 768px) { .contact-hero { margin: 0 2rem 0; min-height: 420px; } }
        @media (min-width: 1024px) { .contact-hero { margin: 0 3rem 0; } }

        .contact-hero-img {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          object-position: center 30%;
          background: linear-gradient(135deg, #4c1d95 0%, #1e1b4b 40%, #6d28d9 100%);
          animation: kenburns-contact 18s ease-in-out infinite alternate;
        }
        @keyframes kenburns-contact {
          from { transform: scale(1); }
          to   { transform: scale(1.06); }
        }

        .contact-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to right,
            rgba(0,0,0,0.65) 0%,
            rgba(30,0,60,0.45) 55%,
            rgba(0,0,0,0.15) 100%);
        }

        .contact-hero-content {
          position: relative; z-index: 2;
          padding: 3rem 2rem 2.5rem;
          max-width: 600px;
        }
        @media (min-width: 768px) { .contact-hero-content { padding: 3.5rem 3rem 3rem; } }

        .contact-hero-tag {
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
        .contact-hero-tag-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #f472b6;
          animation: blink 1.8s ease-in-out infinite;
        }
        @keyframes blink { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.5)} }

        .contact-hero-h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 700;
          color: #fff;
          line-height: 1.15;
          margin-bottom: 0.85rem;
        }
        .contact-hero-p {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.82);
          line-height: 1.65;
          margin-bottom: 1.75rem;
          max-width: 440px;
        }

        /* fade helpers */
        .f-left {
          opacity: 0; transform: translateX(-32px);
          transition: opacity 0.72s cubic-bezier(.22,1,.36,1), transform 0.72s cubic-bezier(.22,1,.36,1);
        }
        .f-right {
          opacity: 0; transform: translateX(32px);
          transition: opacity 0.72s cubic-bezier(.22,1,.36,1), transform 0.72s cubic-bezier(.22,1,.36,1);
        }
        .f-left.vis, .f-right.vis { opacity: 1; transform: none; }
        .fd1{transition-delay:.05s} .fd2{transition-delay:.18s}

        /* hero stagger */
        .h-tag  { opacity:0; transform:translateY(16px); transition: opacity .5s ease .1s, transform .5s ease .1s; }
        .h-h1   { opacity:0; transform:translateY(20px); transition: opacity .6s ease .25s, transform .6s ease .25s; }
        .h-p    { opacity:0; transform:translateY(20px); transition: opacity .6s ease .4s,  transform .6s ease .4s; }
        .hero-ready .h-tag,
        .hero-ready .h-h1,
        .hero-ready .h-p { opacity:1; transform:translateY(0); }

        /* ── MAIN GRID (two columns) ── */
        .contact-main {
          max-width: 1100px;
          margin: 2.5rem auto;
          padding: 0 1rem;
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 768px) {
          .contact-main { grid-template-columns: 1fr 1.6fr; gap: 2rem; padding: 0 2rem; }
        }
        @media (min-width: 1024px) { .contact-main { padding: 0 3rem; } }

        /* Left Card (Contact Info) */
        .info-card {
          background: #fff;
          border-radius: 1.25rem;
          padding: 2rem 1.75rem;
          box-shadow: 0 4px 28px rgba(80,0,140,0.08);
        }

        .info-h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem;
          font-weight: 700;
          color: #4c1d95;
          margin-bottom: 1.5rem;
        }

        .info-row {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
          margin-bottom: 1.8rem;
        }
        .info-icon {
          width: 2.6rem; height: 2.6rem;
          background: #ede9fe;
          border-radius: 0.65rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #db2777;
          flex-shrink: 0;
        }
        .info-label {
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #6b7280;
          margin-bottom: 0.2rem;
        }
        .info-value {
          font-size: 0.9rem;
          line-height: 1.5;
          color: #1f2937;
        }
        .info-value a {
          color: #db2777;
          text-decoration: none;
        }
        .info-value a:hover { text-decoration: underline; }

        .divider {
          height: 1px;
          background: #e5e7eb;
          margin: 1.8rem 0;
        }

        .social-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 1rem;
        }
        .social-row {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .social-btn {
          width: 40px; height: 40px;
          background: #f9f7fd;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #4a3f6b;
          transition: all 0.2s;
          cursor: pointer;
          text-decoration: none;
        }
        .social-btn:hover {
          background: #db2777;
          color: white;
          border-color: #db2777;
          transform: translateY(-2px);
        }

        /* Right Card (Form) – matches volunteer form styles */
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

        .form-group {
          display: flex; flex-direction: column; gap: 0.4rem;
          margin-bottom: 1rem;
        }
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
          background: #fafafa;
          transition: border-color 0.22s, box-shadow 0.22s;
          outline: none;
        }
        .form-input:focus, .form-textarea:focus {
          border-color: #7c3aed;
          box-shadow: 0 0 0 3px rgba(124,58,237,0.12);
          background: #fff;
        }
        .form-textarea { resize: vertical; min-height: 120px; }

        .btn-submit {
          width: 100%;
          padding: 0.85rem 1.5rem;
          background: linear-gradient(90deg, #db2777 0%, #be185d 100%);
          color: #fff;
          font-size: 0.9375rem;
          font-weight: 600;
          border: none;
          border-radius: 0.55rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1.25rem;
          transition: transform 0.22s, box-shadow 0.22s;
          box-shadow: 0 4px 18px rgba(219,39,119,0.38);
        }
        .btn-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(219,39,119,0.48);
        }
        .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }

        .spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .success-box {
          text-align: center; padding: 2.5rem 1.5rem;
          animation: pop-in 0.5s cubic-bezier(.22,1,.36,1);
        }
        @keyframes pop-in {
          from { opacity:0; transform: scale(0.88); }
          to   { opacity:1; transform: scale(1); }
        }
        .success-icon {
          width: 3.5rem; height: 3.5rem;
          background: linear-gradient(135deg, #db2777, #7c3aed);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
        }
        .success-h {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem;
          font-weight: 700;
          color: #4c1d95;
          margin-bottom: 0.5rem;
        }
        .success-p {
          font-size: 0.875rem;
          color: #6b7280;
          line-height: 1.6;
        }
      `}</style>

      <div className="contact-root">
        {/* Hero Section */}
        <div style={{ background: "#f5f3ff", paddingTop: "1.5rem", paddingBottom: "0" }}>
          <section className={`contact-hero ${heroReady ? "hero-ready" : ""}`}>
            {/* Optional hero image – replace with your own */}
            <img src={contactHeroBg} alt="Contact us" className="contact-hero-img" />
            <div className="contact-hero-overlay" />
            <div className="contact-hero-content">
              <span className="contact-hero-tag h-tag">
                <span className="contact-hero-tag-dot" />
                Get in Touch
              </span>
              <h1 className="contact-hero-h1 h-h1">Contact Us</h1>
              <p className="contact-hero-p h-p">
                We'd love to hear from you. Whether you have a question, a partnership
                proposal, or just want to say hello, feel free to reach out.
              </p>
            </div>
          </section>
        </div>

        {/* Main Grid */}
        <div className="contact-main">
          {/* LEFT: Contact Information */}
          <div ref={leftRef} className={`info-card f-left fd1 ${leftVisible ? "vis" : ""}`}>
            <h2 className="info-h2">Reach Out</h2>

            <div className="info-row">
              <div className="info-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <polyline points="22,4 12,13 2,4"/>
                </svg>
              </div>
              <div>
                <div className="info-label">Official Email</div>
                <div className="info-value"><a href="mailto:wie@susl.lk">wie@susl.lk</a></div>
              </div>
            </div>

            <div className="info-row">
              <div className="info-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div>
                <div className="info-label">Location</div>
                <div className="info-value">
                  Sabaragamuwa University of Sri Lanka<br />
                  P.O. Box 02, Belihuloya, 70140, Sri Lanka.
                </div>
              </div>
            </div>

            <div className="divider" />

            <h3 className="social-title">Follow Us</h3>
            <div className="social-row">
              <a href="#" className="social-btn">{socialIcons.facebook}</a>
              <a href="#" className="social-btn">{socialIcons.instagram}</a>
              <a href="#" className="social-btn">{socialIcons.linkedin}</a>
              <a href="mailto:wie@susl.lk" className="social-btn">{socialIcons.email}</a>
            </div>
          </div>

          {/* RIGHT: Message Form */}
          <div ref={rightRef} className={`form-card f-right fd2 ${rightVisible ? "vis" : ""}`}>
            {submitted ? (
              <div className="success-box">
                <div className="success-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h3 className="success-h">Message Sent!</h3>
                <p className="success-p">
                  Thank you for contacting us.<br />We'll get back to you shortly.
                </p>
              </div>
            ) : (
              <>
                <h2 className="form-h2">Send a Message</h2>
                <p className="form-sub">
                  Fill out the form below and our team will get back to you shortly.
                </p>

                {error && (
                  <div style={{
                    marginBottom: "1.25rem",
                    padding: "0.9rem 1rem",
                    background: "#fee2e2",
                    border: "1px solid #fecaca",
                    borderRadius: "0.5rem",
                    color: "#dc2626",
                    fontSize: "0.875rem",
                    fontWeight: "500"
                  }}>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
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
                    <label className="form-label" htmlFor="email">Email Address</label>
                    <input
                      id="email" name="email" type="email"
                      className="form-input"
                      placeholder="jane@example.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="subject">Subject</label>
                    <input
                      id="subject" name="subject" type="text"
                      className="form-input"
                      placeholder="How can we help you?"
                      value={form.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="message">Message</label>
                    <textarea
                      id="message" name="message"
                      className="form-textarea"
                      rows="4"
                      placeholder="Your message..."
                      value={form.message}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button type="submit" className="btn-submit" disabled={loading}>
                    {loading ? (
                      <><span className="spinner" /> Sending…</>
                    ) : (
                      <>Send Message →</>
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

export default Contact;