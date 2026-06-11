import React, { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import wielogo from "../assets/logo/wie-logo-footer.png";

function useInView(threshold = 0.15) {
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

const socialLinks = [
  {
    href: "https://www.facebook.com/IEEE.WIE.SUSL",
    icon: "mdi:facebook",
    label: "Facebook",
    color: "#1877F2",
  },
  {
    href: "https://www.instagram.com/ieee_wie_susl?igsh=aGFpc3F6c3FnczVs",
    icon: "mdi:instagram",
    label: "Instagram",
    color: "#E1306C",
  },
  {
    href: "https://www.linkedin.com/company/ieee-wie-student-branch-affinity-group-of-susl/",
    icon: "mdi:linkedin",
    label: "LinkedIn",
    color: "#0A66C2",
  },
  {
    href: "https://x.com",
    icon: "ri:twitter-x-fill",  
    label: "X",
    color: "#a5a4a4",
  },
  {
    href: "mailto:ieeewieagsusl@gmail.com",
    icon: "mdi:gmail",            
    label: "Gmail",
    color: "#EA4335",
  },
];

const quickLinks = [
  { label: "Home",     href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Gallery",  href: "/gallery" },
  { label: "Excom",    href: "/excom" },
  { label: "Events",   href: "/events" },
  { label: "Volunteer Calling",   href: "/volunteer" },
  { label: "Contact Us",   href: "/contact" }
];

const Footer = () => {
  const [footerRef, footerVisible] = useInView(0.1);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');

        .footer-root {
          font-family: 'DM Sans', sans-serif;
          position: relative;
          border-top: 1px solid rgba(139,92,246,0.15);
          background: linear-gradient(to bottom, #1a0a3e, #0f0a1e);
          overflow: hidden;
        }

        /* ── ambient glow blobs ── */
        .footer-glow-left {
          position: absolute;
          top: -80px; left: -80px;
          width: 320px; height: 320px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%);
          pointer-events: none;
          animation: float-glow 8s ease-in-out infinite alternate;
        }
        .footer-glow-right {
          position: absolute;
          bottom: -60px; right: -60px;
          width: 260px; height: 260px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(219,39,119,0.10) 0%, transparent 70%);
          pointer-events: none;
          animation: float-glow 10s ease-in-out infinite alternate-reverse;
        }
        @keyframes float-glow {
          from { transform: scale(1) translate(0, 0); }
          to   { transform: scale(1.15) translate(20px, 12px); }
        }

        /* ── top shimmer line ── */
        .footer-shimmer-line {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg,
            transparent 0%, rgba(124,58,237,0.6) 30%,
            rgba(219,39,119,0.6) 70%, transparent 100%);
          animation: shimmer-slide 4s ease-in-out infinite;
        }
        @keyframes shimmer-slide {
          0%,100% { opacity: 0.5; }
          50%      { opacity: 1; }
        }

        /* ── fade-up reveal ── */
        .f-up {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.7s cubic-bezier(.22,1,.36,1),
                      transform 0.7s cubic-bezier(.22,1,.36,1);
        }
        .f-up.vis { opacity: 1; transform: translateY(0); }
        .fd1 { transition-delay: 0.05s; }
        .fd2 { transition-delay: 0.18s; }
        .fd3 { transition-delay: 0.30s; }
        .fd4 { transition-delay: 0.42s; }

        /* ── logo ── */
        .footer-logo {
          transition: filter 0.35s ease, transform 0.35s ease;
          width: 15.5rem;
          margin-bottom: 1.1rem;
        }
        .footer-logo:hover {
          filter: drop-shadow(0 0 10px rgba(219,39,119,0.5));
          transform: scale(1.04);
        }

        /* ── quick links ── */
        .footer-link {
          font-size: 0.875rem;
          color: #9ca3af;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          transition: color 0.22s, gap 0.22s, letter-spacing 0.22s;
        }
        .footer-link::before {
          content: '→';
          font-size: 0.75rem;
          opacity: 0;
          transform: translateX(-6px);
          transition: opacity 0.22s, transform 0.22s;
          color: #a78bfa;
        }
        .footer-link:hover {
          color: #c4b5fd;
          gap: 0.55rem;
          letter-spacing: 0.01em;
        }
        .footer-link:hover::before {
          opacity: 1;
          transform: translateX(0);
        }

        /* ── section headings ── */
        .footer-heading {
          font-size: 0.8125rem;
          font-weight: 600;
          color: #ffffff;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 1.25rem;
          position: relative;
          display: inline-block;
          padding-bottom: 0.4rem;
        }
        .footer-heading::after {
          content: '';
          position: absolute;
          left: 0; bottom: 0;
          width: 100%; height: 1.5px;
          background: linear-gradient(90deg, #7c3aed, #db2777);
          border-radius: 2px;
        }

        /* ── social icons ── */
        .social-icon {
          width: 2.4rem; height: 2.4rem;
          border-radius: 0.6rem;
          background: rgba(139,92,246,0.10);
          border: 1px solid rgba(139,92,246,0.18);
          display: flex; align-items: center; justify-content: center;
          color: #c4b5fd;
          transition: background 0.28s, border-color 0.28s,
                      transform 0.28s cubic-bezier(.22,1,.36,1),
                      box-shadow 0.28s, color 0.28s;
          position: relative;
          overflow: hidden;
          text-decoration: none;
        }
        .social-icon::before {
          content: '';
          position: absolute; inset: 0;
          background: var(--brand-color, #7c3aed);
          opacity: 0;
          transition: opacity 0.28s ease;
          border-radius: inherit;
        }
        .social-icon svg, .social-icon [data-icon] {
          position: relative; z-index: 1;
        }
        .social-icon:hover {
          transform: translateY(-4px) scale(1.08);
          box-shadow: 0 8px 24px rgba(0,0,0,0.35);
          border-color: transparent;
          color: #fff;
        }
        .social-icon:hover::before { opacity: 1; }

        /* ── divider ── */
        .footer-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(139,92,246,0.25), rgba(219,39,119,0.25), transparent);
          margin: 2.5rem 0 1.75rem;
        }

        /* ── bottom bar ── */
        .footer-bottom {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
          text-align: center;
        }
        .footer-copy {
          font-size: 0.75rem;
          color: #6b7280;
          transition: color 0.2s;
        }
        .footer-copy:hover { color: #9ca3af; }
        .footer-heart {
          display: inline-block;
          animation: heartbeat 1.6s ease-in-out infinite;
          color: #db2777;
        }
        @keyframes heartbeat {
          0%,100% { transform: scale(1); }
          14%      { transform: scale(1.25); }
          28%      { transform: scale(1); }
          42%      { transform: scale(1.15); }
          56%      { transform: scale(1); }
        }
      `}</style>

      <footer className="footer-root px-6 md:px-10 py-14">
        <div className="footer-glow-left"></div>
        <div className="footer-glow-right"></div>
        <div className="footer-shimmer-line"></div>

        <div ref={footerRef} className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 relative z-10">

          {/* LEFT — brand */}
          <div className={`f-up fd1 ${footerVisible ? "vis" : ""}`}>
            <img src={wielogo} alt="WIE logo" className="footer-logo" />
            <p style={{ fontSize: "0.875rem", color: "#d1d5db", lineHeight: "1.7", maxWidth: "22rem" }}>
              Empowering women in STEM through academic excellence and leadership.
            </p>
          </div>

          {/* MIDDLE — quick links */}
          <div className={`f-up fd2 ${footerVisible ? "vis" : ""}`}>
            <h4 className="footer-heading">Quick Links</h4>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {quickLinks.map(({ label, href }) => (
                <li key={href}>
                  <a href={href} className="footer-link">{label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT — stay connected */}
          <div className={`f-up fd3 ${footerVisible ? "vis" : ""}`}>
            <h4 className="footer-heading">Stay Connected</h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.65rem" }}>
              {socialLinks.map(({ href, icon, label, color }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("mailto") ? "_self" : "_blank"}
                  rel="noreferrer"
                  className="social-icon"
                  aria-label={label}
                  style={{ "--brand-color": color }}
                  title={label}
                >
                  <Icon icon={icon} width={18} />
                </a>
              ))}
            </div>
            <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "1rem" }}>
              Follow us for updates, events & inspiration.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="footer-divider"></div>
          <div className={`footer-bottom f-up fd4 ${footerVisible ? "vis" : ""}`}>
            <p className="footer-copy">
              © 2026 IEEE WIE SUSL. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;