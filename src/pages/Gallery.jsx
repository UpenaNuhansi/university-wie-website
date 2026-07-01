// pages/Gallery.jsx

import { useEffect, useRef, useState } from 'react';
import GalleryCard from '../components/GalleryCard';

import aurelia1 from '../assets/Gallery/Aurelia(1).jpg';
import aurelia2 from '../assets/Gallery/Aurelia(2).jpg';
import aurelia3 from '../assets/Gallery/Aurelia(3).jpg';
import hope1 from '../assets/Gallery/Hope(1).jpg';
import hope2 from '../assets/Gallery/Hope(2).jpg';
import hope3 from '../assets/Gallery/Hope(3).jpg';
import hope4 from '../assets/Gallery/Hope(4).jpg';
import hope5 from '../assets/Gallery/Hope(5).jpg';
import pearlHack1 from '../assets/Gallery/Pearl Hack(1).jpg';
import pearlHack from '../assets/Gallery/Pearl Hack.jpg';

const localImages = [
  { category: 'AURELIA', image: aurelia1, title: 'Aurelia Workshop' },
  { category: 'AURELIA', image: aurelia2, title: 'Aurelia Coding Session' },
  { category: 'AURELIA', image: aurelia3, title: 'Aurelia Mentoring' },
  { category: 'HOPE', image: hope1, title: 'HOPE Outreach' },
  { category: 'HOPE', image: hope2, title: 'HOPE Seminar' },
  { category: 'HOPE', image: hope3, title: 'HOPE Team Gathering' },
  { category: 'HOPE', image: hope4, title: 'HOPE Panel Discussion' },
  { category: 'HOPE', image: hope5, title: 'HOPE STEM Activities' },
  { category: 'PEARL HACK', image: pearlHack1, title: 'Pearl Hack Hackathon' },
  { category: 'PEARL HACK', image: pearlHack, title: 'Pearl Hack Closing' },
].filter(item => item.image);

const galleryImages = localImages.map((img, index) => ({
  id: index + 1,
  category: img.category,
  image: img.image,
  title: img.title,
  description: `${img.title} event image.`,
  createdAt: new Date(2026, 0, index + 1)
}));


/* ─────────────────────────────────────────────
   Inject global styles once (fonts + keyframes)
  ───────────────────────────────────────────── */
const GLOBAL_STYLE = `
  :root {
    --primary:      #4c1d95;
    --accent:       #db2777;
    --purple-dark:  #1e0538;
    --purple-light: rgba(218, 185, 255, 0.3);
    --purple-200:   #e9d5ff;
    --purple-100:   #f3e8ff;
    --white:        #ffffff;
    --gray-500:     #6b7280;
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

const FIXED_CATEGORIES = ['All', 'AURELIA', 'PEARL HACK', 'HOPE'];

export default function Gallery() {
  const [gallery]                           = useState(galleryImages);
  const [filtered, setFiltered]             = useState(galleryImages);
  const [activeCategory, setActiveCategory] = useState('All');
  const [visibleCount, setVisibleCount]     = useState(6);
  const [loading]                           = useState(false);
  const [gridKey, setGridKey]               = useState(0); // forces re-animation on filter

  const [heroRef,  heroVisible]  = useReveal(0.05);
  const [filterRef, filterVisible] = useReveal(0.08);
  const [gridRef,  gridVisible]  = useReveal(0.05);

  useEffect(() => {
    injectGalleryStyles();
  }, []);

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
        * { box-sizing: border-box; }

        .gal-root {
          overflow-x: hidden;
          min-height: 100vh;
        }

        /* ── Hero band ── */
        .gal-hero {
          position: relative;
          overflow: hidden;
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
          color: var(--primary);
          border-color: rgba(76, 29, 149, 0.15);
          box-shadow: 0 2px 8px rgba(76, 29, 149, 0.05);
        }

        .gal-filter-btn.inactive:hover {
          background: var(--purple-100);
          border-color: rgba(76, 29, 149, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(76, 29, 149, 0.10);
        }

        .gal-filter-btn.active {
          background: var(--accent);
          color: #fff;
          border-color: transparent;
          box-shadow: 0 4px 18px rgba(219, 39, 119, 0.35);
          transform: translateY(-1px);
        }

        .gal-filter-btn.active:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 28px rgba(219, 39, 119, 0.45);
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
          color: var(--accent);
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
          border-radius: 24px;
          overflow: hidden;
          background: var(--white);
          border: 1px solid var(--purple-100);
          box-shadow: 0 2px 14px rgba(76, 29, 149, 0.05);
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
          border-radius: 16px;
          background: var(--purple-light);
          border: 1px solid var(--purple-100);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: var(--accent);
        }

        .gal-empty-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary);
          margin: 0 0 8px;
        }

        .gal-empty-sub {
          font-size: 0.88rem;
          color: #333333;
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
          border: 2px solid var(--primary);
          color: var(--primary);
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
          background: var(--primary);
          color: #fff;
          transform: translateY(-3px);
          box-shadow: 0 10px 28px rgba(76, 29, 149, 0.2);
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

      <div className="gal-root bg-purpleLight font-sans">

        {/* ── Hero ── */}
        <div className="gal-hero bg-purpleLight" ref={heroRef}>
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-purple-100 shadow-sm mb-8 f-up ${heroVisible ? 'vis' : ''}`}
            style={{ transitionDelay: '0.04s' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" aria-hidden="true" />
            <span className="text-[10px] md:text-xs font-semibold tracking-widest text-primary/80 uppercase font-sans">
              Visual Journey
            </span>
          </div>
          <h1
            className={`font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight f-up ${heroVisible ? 'vis' : ''}`}
            style={{ transitionDelay: '0.12s' }}
          >
            Our Community in <span className="text-accent font-accentFont">Action</span>
          </h1>
          <p
            className={`font-sans text-gray-800 text-base md:text-lg max-w-2xl mx-auto leading-relaxed f-up ${heroVisible ? 'vis' : ''}`}
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