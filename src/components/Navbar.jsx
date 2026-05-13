import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import wieLogo from "../assets/logo/wie-logo-nav.png";
import { Icon } from "@iconify/react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mobileRef = useRef(null);
  const location = useLocation(); // ✅ always reflects current route

  /* ── shrink navbar on scroll ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── close mobile menu on outside click ── */
  useEffect(() => {
    const handler = (e) => {
      if (mobileRef.current && !mobileRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── close mobile menu on route change ── */
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: "Home",    href: "/" },
    { label: "About",   href: "/about" },
    { label: "Gallery", href: "/gallery" },
    { label: "Excom",   href: "/excom" },
    { label: "Events",  href: "/events" },
  ];

  /* exact match for "/" so /about doesn't also mark Home active */
  const isActive = (href) =>
    href === "/" ? location.pathname === "/" : location.pathname.startsWith(href);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');

        .nav-root {
          font-family: 'DM Sans', sans-serif;
          position: sticky;
          top: 0;
          z-index: 50;
          width: 100%;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          border-bottom: 1px solid rgba(124,58,237,0.08);
          transition: box-shadow 0.35s ease, background 0.35s ease;
        }
        .nav-root.scrolled {
          box-shadow: 0 4px 32px rgba(80,0,140,0.10);
          background: rgba(255,255,255,0.97);
        }

        .nav-inner {
          max-width: 80rem;
          margin: 0 auto;
          padding: 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: padding-top 0.35s ease, padding-bottom 0.35s ease;
        }
        .nav-inner.scrolled { padding-top: 0.6rem; padding-bottom: 0.6rem; }
        @media (min-width: 640px)  { .nav-inner { padding-left: 1.5rem; padding-right: 1.5rem; } }
        @media (min-width: 1024px) { .nav-inner { padding-left: 2rem;   padding-right: 2rem;   } }

        /* logo */
        .logo-wrap { display: flex; align-items: center; gap: 0.75rem; text-decoration: none; }
        .logo-img {
          height: 2.5rem; object-fit: contain;
          transition: transform 0.4s cubic-bezier(.22,1,.36,1), filter 0.3s ease;
        }
        .logo-wrap:hover .logo-img {
          transform: scale(1.06) rotate(-1deg);
          filter: drop-shadow(0 2px 8px rgba(219,39,119,0.3));
        }
        .logo-text-main { font-weight: 600; color: #4c1d95; font-size: 0.875rem; line-height: 1.2; }
        .logo-text-sub  { color: #9ca3af; font-size: 0.7rem; }
        .logo-text-block { display: none; }
        @media (min-width: 640px) { .logo-text-block { display: block; } }

        /* desktop links — hidden below 1024px */
        .desktop-links {
          display: none;
          list-style: none; margin: 0; padding: 0;
          align-items: center; gap: 1.75rem;
        }
        @media (min-width: 1024px) { .desktop-links { display: flex; } }

        .nav-link {
          position: relative;
          font-size: 0.875rem; font-weight: 500;
          color: #4b5563; text-decoration: none;
          padding-bottom: 3px;
          transition: color 0.22s ease;
        }
        .nav-link::after {
          content: '';
          position: absolute; left: 0; bottom: -1px;
          width: 0; height: 2px;
          background: linear-gradient(90deg, #db2777, #7c3aed);
          border-radius: 2px;
          transition: width 0.3s cubic-bezier(.22,1,.36,1);
        }
        .nav-link:hover { color: #7c3aed; }
        .nav-link:hover::after { width: 100%; }
        .nav-link.active { color: #db2777; font-weight: 600; }
        .nav-link.active::after { width: 100%; background: #db2777; }

        /* desktop CTA — hidden below 1024px */
        .desktop-cta {
          display: none;
          align-items: center; gap: 0.75rem;
        }
        @media (min-width: 1024px) { .desktop-cta { display: flex; } }

        .btn-outline-nav {
          border: 1.5px solid #7c3aed; color: #7c3aed;
          padding: 0.45rem 1.1rem; border-radius: 0.45rem;
          font-size: 0.8125rem; font-weight: 500;
          text-decoration: none; background: transparent;
          position: relative; overflow: hidden;
          transition: color 0.28s, transform 0.22s, box-shadow 0.22s;
          display: inline-block;
        }
        .btn-outline-nav::before {
          content: ''; position: absolute; inset: 0;
          background: #ede9fe; transform: scaleX(0); transform-origin: left;
          transition: transform 0.28s ease; z-index: 0;
        }
        .btn-outline-nav span { position: relative; z-index: 1; }
        .btn-outline-nav:hover::before { transform: scaleX(1); }
        .btn-outline-nav:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(124,58,237,0.2); }

        .btn-solid-nav {
          background: #db2777; color: #fff;
          padding: 0.45rem 1.1rem; border-radius: 0.45rem;
          font-size: 0.8125rem; font-weight: 500;
          text-decoration: none; display: inline-block;
          position: relative; overflow: hidden;
          transition: transform 0.22s, box-shadow 0.22s;
          box-shadow: 0 2px 12px rgba(219,39,119,0.3);
        }
        .btn-solid-nav::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.22) 50%, transparent 70%);
          transform: translateX(-100%); transition: transform 0.5s ease;
        }
        .btn-solid-nav:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(219,39,119,0.4); }
        .btn-solid-nav:hover::after { transform: translateX(100%); }

        /* hamburger — ONLY visible below 1024px */
        .hamburger {
          display: none;
          background: none; border: none; cursor: pointer;
          color: #4c1d95; padding: 0.3rem; border-radius: 0.4rem;
          align-items: center; justify-content: center;
          transition: background 0.2s, transform 0.22s;
        }
        @media (max-width: 1023px) { .hamburger { display: flex; } }
        .hamburger:hover { background: #ede9fe; transform: scale(1.08); }

        /* mobile menu — completely removed from DOM flow on desktop */
        .mobile-menu {
          overflow: hidden;
          max-height: 0; opacity: 0;
          transition: max-height 0.42s cubic-bezier(.22,1,.36,1), opacity 0.32s ease;
          border-top: 1px solid rgba(124,58,237,0.08);
          background: rgba(255,255,255,0.98);
        }
        .mobile-menu.open { max-height: 540px; opacity: 1; }
        @media (min-width: 1024px) { .mobile-menu { display: none !important; } }

        .mobile-inner {
          padding: 0.75rem 1.25rem 1.5rem;
          display: flex; flex-direction: column;
        }

        .mobile-link {
          display: block;
          padding: 0.7rem 0.75rem;
          font-size: 0.9rem; font-weight: 500;
          color: #4b5563; text-decoration: none;
          border-bottom: 1px solid rgba(124,58,237,0.06);
          border-radius: 0.4rem;
          border-left: 3px solid transparent;
          transition: color 0.2s, padding-left 0.25s ease, background 0.2s, border-left-color 0.2s;
        }
        .mobile-link:hover {
          color: #7c3aed; padding-left: 1.2rem;
          background: rgba(237,233,254,0.5);
        }
        .mobile-link.active {
          color: #db2777; font-weight: 600;
          background: rgba(253,242,248,0.6);
          border-left-color: #db2777;
          padding-left: 1rem;
        }

        .mobile-cta-wrap { display: flex; flex-direction: column; gap: 0.5rem; margin-top: 1rem; }

        .mobile-btn-outline {
          border: 1.5px solid #7c3aed; color: #7c3aed;
          padding: 0.6rem 1rem; border-radius: 0.5rem;
          font-size: 0.875rem; font-weight: 500;
          text-align: center; text-decoration: none; display: block;
          transition: background 0.22s, transform 0.22s;
        }
        .mobile-btn-outline:hover { background: #ede9fe; transform: translateY(-1px); }

        .mobile-btn-solid {
          background: #db2777; color: #fff;
          padding: 0.6rem 1rem; border-radius: 0.5rem;
          font-size: 0.875rem; font-weight: 500;
          text-align: center; text-decoration: none; display: block;
          box-shadow: 0 2px 10px rgba(219,39,119,0.28);
          transition: background 0.22s, transform 0.22s, box-shadow 0.22s;
        }
        .mobile-btn-solid:hover { background: #be185d; transform: translateY(-1px); box-shadow: 0 5px 16px rgba(219,39,119,0.38); }
      `}</style>

      <nav ref={mobileRef} className={`nav-root ${scrolled ? "scrolled" : ""}`}>

        {/* TOP BAR */}
        <div className={`nav-inner ${scrolled ? "scrolled" : ""}`}>

          {/* Logo */}
          <Link to="/" className="logo-wrap">
            <img src={wieLogo} alt="logo" className="logo-img" />
            {/* <div className="logo-text-block">
              <p className="logo-text-main">Sabaragamuwa University of Sri Lanka</p>
              <p className="logo-text-sub">IEEE Student Branch</p>
            </div> */}
          </Link>

          {/* Desktop nav links */}
          <ul className="desktop-links">
            {navLinks.map(({ label, href }) => (
              <li key={href}>
                <Link to={href} className={`nav-link ${isActive(href) ? "active" : ""}`}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA buttons */}
          <div className="desktop-cta">
            <Link to="/volunteer" className="btn-outline-nav">
              <span>Volunteer Calling</span>
            </Link>
            <Link to="/contactus" className="btn-solid-nav">
              Contact Us
            </Link>
          </div>

          {/* Hamburger — mobile/tablet only */}
          <button
            className="hamburger"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <Icon
              icon={isOpen ? "mdi:close" : "mdi:menu"}
              width={26}
              style={{
                transition: "transform 0.3s ease",
                transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
              }}
            />
          </button>
        </div>

        {/* MOBILE MENU */}
        <div className={`mobile-menu ${isOpen ? "open" : ""}`} aria-hidden={!isOpen}>
          <div className="mobile-inner">
            {navLinks.map(({ label, href }) => (
              <Link
                key={href}
                to={href}
                className={`mobile-link ${isActive(href) ? "active" : ""}`}
              >
                {label}
              </Link>
            ))}
            <div className="mobile-cta-wrap">
              <Link to="/volunteer" className="mobile-btn-outline">Volunteer Calling</Link>
              <Link to="/contactus" className="mobile-btn-solid">Contact Us</Link>
            </div>
          </div>
        </div>

      </nav>
    </>
  );
};

export default Navbar;