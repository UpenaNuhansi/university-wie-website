// pages/Gallery.jsx

import { useEffect, useRef, useState } from 'react';
import { getGalleryItems } from '../services/galleryService';
import GalleryCard from '../components/GalleryCard';

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
    --bg-base:    #f3e8f7;
    --white:      #ffffff;
    --gray-600:   #4b5563;
    --gray-500:   #6b7280;
    --gray-200:   #e5e7eb;
    --gray-100:   #f3f4f6;
  }

  @keyframes gal-fadeUp {
    from { opacity: 0; transform: translateY(26px); }
    to   { opacity: 1; transform: translateY(0);    }
  }

  @keyframes gal-fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  @keyframes gal-scaleIn {
    from { opacity: 0; transform: scale(0.94) translateY(16px); }
    to   { opacity: 1; transform: scale(1)    translateY(0);    }
  }

  @keyframes gal-spin {
    to { transform: rotate(360deg); }
  }

  @keyframes gal-shimmer {
    0%   { background-position: -800px 0; }
    100% { background-position:  800px 0; }
  }

  @keyframes gal-orb {
    0%, 100% { transform: translate(0, 0)   scale(1);    }
    33%       { transform: translate(18px, -14px) scale(1.06); }
    66%       { transform: translate(-12px, 10px) scale(0.95); }
  }
`;

function injectGalleryStyles() {
  if (document.getElementById('gallery-global-style')) return;
  const el = document.createElement('style');
  el.id = 'gallery-global-style';
  el.textContent = GLOBAL_STYLE;
  document.head.appendChild(el);
}

/* ─────────────────────────────────────────────
   Intersection observer — scroll reveal
───────────────────────────────────────────── */
function useReveal(threshold = 0.08) {
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

const FIXED_CATEGORIES = ['All', 'WIE Day', 'Hackathons', 'Summits'];

export default function Gallery() {
  const [gallery, setGallery]               = useState([]);
  const [filtered, setFiltered]             = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [visibleCount, setVisibleCount]     = useState(6);
  const [loading, setLoading]               = useState(true);
  const [gridKey, setGridKey]               = useState(0); // forces re-animation on filter

  const [heroRef,  heroVisible]  = useReveal(0.05);
  const [filterRef, filterVisible] = useReveal(0.08);
  const [gridRef,  gridVisible]  = useReveal(0.05);

  useEffect(() => {
    injectGalleryStyles();
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const data = await getGalleryItems();
      setGallery(data);
      setFiltered(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const dynamicCategories = [
    ...FIXED_CATEGORIES,
    ...gallery
      .map((item) => item.category)
      .filter((cat) => cat && !FIXED_CATEGORIES.includes(cat))
      .filter((cat, i, arr) => arr.indexOf(cat) === i),
  ];

  const handleFilter = (category) => {
    setActiveCategory(category);
    setFiltered(category === 'All' ? gallery : gallery.filter((item) => item.category === category));
    setVisibleCount(6);
    setGridKey((k) => k + 1); // re-trigger card animations
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; }

        .gal-root {
          font-family: 'DM Sans', sans-serif;
          background: var(--bg-base);
          overflow-x: hidden;
          min-height: 100vh;
        }

        /* ── Hero band ── */
        .gal-hero {
          position: relative;
          overflow: hidden;
          background: var(--bg-base);
          padding: clamp(56px, 8vw, 100px) clamp(20px, 5vw, 72px) clamp(40px, 6vw, 72px);
          text-align: center;
        }

        /* Decorative floating orbs — pure CSS, no JS */
        .gal-hero::before,
        .gal-hero::after {
          content: '';
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(60px);
        }

        .gal-hero::before {
          width: 420px;
          height: 420px;
          top: -120px;
          left: -100px;
          background: radial-gradient(circle, rgba(147,51,234,0.13) 0%, transparent 70%);
          animation: gal-orb 12s ease-in-out infinite;
        }

        .gal-hero::after {
          width: 320px;
          height: 320px;
          bottom: -80px;
          right: -80px;
          background: radial-gradient(circle, rgba(219,39,119,0.10) 0%, transparent 70%);
          animation: gal-orb 15s ease-in-out infinite reverse;
        }

        .gal-eyebrow {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: var(--purple-600);
          margin: 0 0 14px;
          position: relative;
          display: inline-block;
        }

        /* Small decorative line beside eyebrow */
        .gal-eyebrow::before,
        .gal-eyebrow::after {
          content: '';
          display: inline-block;
          width: 28px;
          height: 1.5px;
          background: var(--purple-600);
          vertical-align: middle;
          border-radius: 2px;
          opacity: 0.5;
        }

        .gal-eyebrow::before { margin-right: 10px; }
        .gal-eyebrow::after  { margin-left:  10px; }

        .gal-hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(32px, 5vw, 58px);
          font-weight: 700;
          color: var(--purple-900);
          margin: 0 0 18px;
          line-height: 1.1;
          letter-spacing: -0.02em;
          position: relative;
        }

        .gal-hero-sub {
          font-size: clamp(0.875rem, 1.5vw, 1rem);
          color: var(--purple-800);
          opacity: 0.78;
          max-width: 560px;
          margin: 0 auto;
          line-height: 1.75;
          position: relative;
        }

        /* ── Filter strip ── */
        .gal-filter-wrap {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
          padding: 0 clamp(20px, 5vw, 72px) 0;
          margin-bottom: clamp(36px, 5vw, 56px);
          position: relative;
        }

        .gal-filter-btn {
          border-radius: 999px;
          padding: 9px 22px;
          font-size: 0.82rem;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.02em;
          border: 2px solid transparent;
          cursor: pointer;
          transition:
            background   0.25s cubic-bezier(0.22, 1, 0.36, 1),
            color        0.25s cubic-bezier(0.22, 1, 0.36, 1),
            transform    0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
            box-shadow   0.25s ease,
            border-color 0.25s ease;
          will-change: transform;
          position: relative;
          overflow: hidden;
        }

        .gal-filter-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.15);
          opacity: 0;
          transition: opacity 0.2s;
          border-radius: inherit;
        }

        .gal-filter-btn:hover::after { opacity: 1; }

        .gal-filter-btn.inactive {
          background: var(--white);
          color: var(--purple-700);
          border-color: rgba(147,51,234,0.15);
          box-shadow: 0 2px 8px rgba(74,21,114,0.05);
        }

        .gal-filter-btn.inactive:hover {
          background: var(--purple-100);
          border-color: rgba(147,51,234,0.3);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(74,21,114,0.10);
        }

        .gal-filter-btn.active {
          background: linear-gradient(135deg, var(--pink-600) 0%, #c026d3 100%);
          color: #fff;
          border-color: transparent;
          box-shadow: 0 4px 18px rgba(219,39,119,0.35);
          transform: translateY(-1px);
        }

        .gal-filter-btn.active:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 28px rgba(219,39,119,0.45);
        }

        /* ── Grid section ── */
        .gal-grid-section {
          padding: 0 clamp(20px, 5vw, 72px) clamp(56px, 8vw, 96px);
          max-width: 1280px;
          margin: 0 auto;
        }

        .gal-count-label {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--gray-500);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 24px;
          display: block;
        }

        .gal-grid {
          display: grid;
          gap: clamp(18px, 2.5vw, 28px);
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        }

        /* Card wrapper — staggered appear animation */
        .gal-card-wrap {
          animation: gal-scaleIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
          will-change: transform, opacity;
        }

        /* ── Skeleton loader ── */
        .gal-skeleton-grid {
          display: grid;
          gap: clamp(18px, 2.5vw, 28px);
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          margin-top: 4px;
        }

        .gal-skeleton-card {
          border-radius: 20px;
          overflow: hidden;
          background: var(--white);
          box-shadow: 0 2px 14px rgba(74,21,114,0.05);
        }

        .gal-skeleton-img {
          aspect-ratio: 4/3;
          background: linear-gradient(
            90deg,
            #ede0f5 25%,
            #f3e8ff 50%,
            #ede0f5 75%
          );
          background-size: 800px 100%;
          animation: gal-shimmer 1.6s ease-in-out infinite;
        }

        .gal-skeleton-body {
          padding: 18px 20px;
        }

        .gal-skeleton-line {
          border-radius: 6px;
          background: linear-gradient(
            90deg,
            #ede0f5 25%,
            #f3e8ff 50%,
            #ede0f5 75%
          );
          background-size: 800px 100%;
          animation: gal-shimmer 1.6s ease-in-out infinite;
        }

        /* ── Empty state ── */
        .gal-empty {
          text-align: center;
          padding: clamp(48px, 8vw, 96px) 20px;
          animation: gal-fadeUp 0.55s ease both;
        }

        .gal-empty-icon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: var(--purple-100);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: var(--purple-600);
        }

        .gal-empty-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--purple-900);
          margin: 0 0 8px;
        }

        .gal-empty-sub {
          font-size: 0.88rem;
          color: var(--gray-500);
          margin: 0;
        }

        /* ── Divider ── */
        .gal-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--purple-200) 30%, var(--purple-200) 70%, transparent);
          border: none;
          margin: 0 clamp(20px, 5vw, 72px) clamp(36px, 5vw, 52px);
        }

        /* ── Load more ── */
        .gal-load-wrap {
          text-align: center;
          margin-top: clamp(40px, 5vw, 60px);
        }

        .gal-load-btn {
          border: 2px solid var(--purple-900);
          color: var(--purple-900);
          background: transparent;
          padding: 13px 36px;
          border-radius: 12px;
          font-size: 0.88rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition:
            background  0.28s ease,
            color       0.28s ease,
            transform   0.28s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow  0.28s ease;
          will-change: transform;
        }

        .gal-load-btn:hover {
          background: var(--purple-900);
          color: #fff;
          transform: translateY(-3px);
          box-shadow: 0 10px 28px rgba(74,21,114,0.2);
        }

        .gal-load-btn:active {
          transform: translateY(-1px);
        }

        /* ── Scroll reveal ── */
        .f-up {
          opacity: 0;
          transform: translateY(22px);
          transition:
            opacity   0.65s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .f-up.vis {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      <div className="gal-root">

        {/* ── Hero ── */}
        <div className="gal-hero" ref={heroRef}>
          <p
            className={`gal-eyebrow f-up ${heroVisible ? 'vis' : ''}`}
            style={{ transitionDelay: '0.04s' }}
          >
            Visual Journey
          </p>
          <h1
            className={`gal-hero-title f-up ${heroVisible ? 'vis' : ''}`}
            style={{ transitionDelay: '0.12s' }}
          >
            Our Community in Action
          </h1>
          <p
            className={`gal-hero-sub f-up ${heroVisible ? 'vis' : ''}`}
            style={{ transitionDelay: '0.2s' }}
          >
            Capturing impactful moments, inspiring events, and brilliant minds that
            shape our women in STEM community.
          </p>
        </div>

        {/* ── Filter strip ── */}
        <div
          className={`gal-filter-wrap f-up ${filterVisible ? 'vis' : ''}`}
          ref={filterRef}
          style={{ transitionDelay: '0.08s' }}
        >
          {dynamicCategories.map((cat, i) => (
            <button
              key={cat}
              onClick={() => handleFilter(cat)}
              className={`gal-filter-btn ${activeCategory === cat ? 'active' : 'inactive'}`}
              style={{ transitionDelay: `${i * 0.04}s` }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Divider ── */}
        <hr className="gal-divider" />

        {/* ── Grid / Loading / Empty ── */}
        <div className="gal-grid-section" ref={gridRef}>

          {loading ? (
            /* Skeleton loader */
            <div className="gal-skeleton-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="gal-skeleton-card" style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className="gal-skeleton-img" />
                  <div className="gal-skeleton-body">
                    <div className="gal-skeleton-line" style={{ height: 18, width: '70%', marginBottom: 10 }} />
                    <div className="gal-skeleton-line" style={{ height: 13, width: '40%' }} />
                  </div>
                </div>
              ))}
            </div>

          ) : filtered.length === 0 ? (
            /* Empty state */
            <div className="gal-empty">
              <div className="gal-empty-icon">
                <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="gal-empty-title">No images yet</p>
              <p className="gal-empty-sub">No images in this category yet. Check back soon.</p>
            </div>

          ) : (
            <>
              {/* Count label */}
              <span
                className={`gal-count-label f-up ${gridVisible ? 'vis' : ''}`}
                style={{ transitionDelay: '0.04s' }}
              >
                {filtered.length} {filtered.length === 1 ? 'moment' : 'moments'}
                {activeCategory !== 'All' && ` · ${activeCategory}`}
              </span>

              {/* Card grid — re-keyed on filter change to replay animations */}
              <div className="gal-grid" key={gridKey}>
                {filtered.slice(0, visibleCount).map((item, i) => (
                  <div
                    key={item.id}
                    className="gal-card-wrap"
                    style={{ animationDelay: `${Math.min(i, 5) * 0.07}s` }}
                  >
                    <GalleryCard item={item} />
                  </div>
                ))}
              </div>

              {/* Load more */}
              {visibleCount < filtered.length && (
                <div className="gal-load-wrap">
                  <button
                    className="gal-load-btn"
                    onClick={() => setVisibleCount((prev) => prev + 6)}
                  >
                    Load More Moments
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}