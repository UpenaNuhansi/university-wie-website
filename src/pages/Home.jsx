import React, { useEffect, useRef, useState } from "react";
import hero from "../assets/home/hero.jpg";
import secondimg from "../assets/home/home-pg-2.jpg";
import useFetchEvents from "../hooks/useFetchEvents";
import HomeEventsSection from "../components/HomeEventsSection";

/* ── tiny hook: fires when element enters viewport ── */
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

/* ── animated counter ── */
function Counter({ target, suffix = "+" }) {
  const [count, setCount] = useState(0);
  const [ref, visible] = useInView(0.5);
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = Math.ceil(target / 40);
    const t = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(t); }
      else setCount(start);
    }, 30);
    return () => clearInterval(t);
  }, [visible, target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

const Home = () => {
  /* hero text stagger state */
  const [heroReady, setHeroReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setHeroReady(true), 100); return () => clearTimeout(t); }, []);

  /* section refs */
  const [whoRef, whoVisible] = useInView();
  const [eventsRef, eventsVisible] = useInView();

  /* fetch events */
  const { events, loading } = useFetchEvents();

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }

        /* ── fade-slide helpers ── */
        .fade-up {
          opacity: 0;
          transform: translateY(32px);
          transition: opacity 0.75s cubic-bezier(.22,1,.36,1),
                      transform 0.75s cubic-bezier(.22,1,.36,1);
        }
        .fade-up.visible { opacity: 1; transform: translateY(0); }

        .fade-left {
          opacity: 0;
          transform: translateX(-40px);
          transition: opacity 0.8s cubic-bezier(.22,1,.36,1),
                      transform 0.8s cubic-bezier(.22,1,.36,1);
        }
        .fade-left.visible { opacity: 1; transform: translateX(0); }

        .fade-right {
          opacity: 0;
          transform: translateX(40px);
          transition: opacity 0.8s cubic-bezier(.22,1,.36,1),
                      transform 0.8s cubic-bezier(.22,1,.36,1);
        }
        .fade-right.visible { opacity: 1; transform: translateX(0); }

        /* stagger delays */
        .d1 { transition-delay: 0.05s; }
        .d2 { transition-delay: 0.18s; }
        .d3 { transition-delay: 0.32s; }
        .d4 { transition-delay: 0.46s; }
        .d5 { transition-delay: 0.60s; }

        /* ── hero card glass ── */
        .hero-card {
          background: rgba(255,255,255,0.58);
          backdrop-filter: blur(18px) saturate(160%);
          -webkit-backdrop-filter: blur(18px) saturate(160%);
          border: 1px solid rgba(255,255,255,0.7);
          border-radius: 1.25rem;
          box-shadow: 0 8px 40px rgba(80,0,120,0.18), 0 1.5px 0 rgba(255,255,255,0.8) inset;
          padding: 2.5rem;
          max-width: 32rem;
        }

        /* ── hero image ken-burns ── */
        .hero-img {
          animation: kenburns 18s ease-in-out infinite alternate;
          transform-origin: center;
        }
        @keyframes kenburns {
          from { transform: scale(1);   }
          to   { transform: scale(1.06); }
        }

        /* ── overlay shimmer ── */
        .hero-overlay {
          background: linear-gradient(135deg, rgba(0,0,0,0.42) 0%, rgba(60,0,90,0.28) 100%);
        }

        /* ── CTA button ── */
        .btn-primary {
          position: relative;
          display: inline-block;
          background: #db2777;
          color: #fff;
          padding: 0.75rem 1.75rem;
          border-radius: 0.5rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          letter-spacing: 0.03em;
          overflow: hidden;
          transition: transform 0.22s ease, box-shadow 0.22s ease;
          box-shadow: 0 4px 18px rgba(219,39,119,0.35);
          text-decoration: none;
        }
        .btn-primary::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%);
          transform: translateX(-100%);
          transition: transform 0.55s ease;
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(219,39,119,0.45); }
        .btn-primary:hover::after { transform: translateX(100%); }

        /* ── outline button ── */
        .btn-outline {
          border: 1.5px solid #4c1d95;
          padding: 0.625rem 1.5rem;
          border-radius: 0.5rem;
          color: #4c1d95;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          background: transparent;
          cursor: pointer;
          transition: background 0.25s, color 0.25s, transform 0.22s;
        }
        .btn-outline:hover { background: #f3e8ff; transform: translateY(-1px); }

        /* ── stat badge ── */
        .stat-badge {
          position: absolute;
          background: #fff;
          border-radius: 0.875rem;
          padding: 0.75rem 1.1rem;
          box-shadow: 0 4px 24px rgba(80,0,140,0.14);
          transition: transform 0.3s ease;
        }
        .stat-badge:hover { transform: scale(1.06) rotate(-1deg); }

        /* ── image hover lift ── */
        .img-lift {
          transition: transform 0.5s cubic-bezier(.22,1,.36,1), box-shadow 0.5s ease;
        }
        .img-lift:hover {
          transform: scale(1.02) translateY(-4px);
          box-shadow: 0 20px 50px rgba(80,0,120,0.18);
        }

        /* ── decorative grain overlay on sections ── */
        .grain::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          mix-blend-mode: multiply;
        }

      `}</style>

      <div className="w-full font-sans">

        {/* ================= HERO ================= */}
        <section className="relative min-h-[500px] md:h-[600px]">
          <img
            src={hero}
            alt="hero"
            className="hero-img absolute inset-0 w-full h-full object-cover"
          />
          <div className="hero-overlay absolute inset-0"></div>

          <div className="relative z-10 flex items-center h-full min-h-[500px]">
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
              <div className={`hero-card fade-up ${heroReady ? "visible" : ""} d1`}>

                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-purple-100 shadow-sm mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
                  <span className="text-[10px] md:text-xs font-semibold tracking-widest text-primary/80 uppercase font-sans">
                    Empowering Women in STEM
                  </span>
                </div>

                <h1 className={`font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-primary leading-tight mb-4 fade-up ${heroReady ? "visible" : ""} d2`}>
                  Inspiring the Next Generation of <span className="text-accent font-accentFont">Female</span> Engineers
                </h1>

                <p className={`font-sans text-gray-800 text-sm mb-6 fade-up ${heroReady ? "visible" : ""} d3`}>
                  IEEE Women in Engineering (WIE) at Sabaragamuwa University of Sri Lanka
                  is dedicated to promoting women engineers and scientists.
                </p>

                <a href="/volunteer" className={`btn-primary fade-up ${heroReady ? "visible" : ""} d4`}>
                  Volunteer Calling →
                </a>
              </div>
            </div>
          </div>
        </section>


        {/* ================= WHO WE ARE ================= */}
        <section className="bg-purpleLight py-16 md:py-20 relative">
          <div ref={whoRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10 items-center">

            {/* IMAGE */}
            <div className={`relative fade-left ${whoVisible ? "visible" : ""} d1`}>
              <img
                src={secondimg}
                alt="who we are"
                className="img-lift rounded-xl shadow-lg w-full"
              />
              <div className={`stat-badge -top-4 -left-4 hidden sm:block fade-up ${whoVisible ? "visible" : ""} d3`}>
                <p className="font-serif text-accent font-bold text-lg leading-none">
                  <Counter target={50} />
                </p>
                <p className="font-sans text-xs text-gray-500 mt-0.5">Events Hosted</p>
              </div>
              <div className={`stat-badge -bottom-4 right-4 hidden sm:block fade-up ${whoVisible ? "visible" : ""} d4`}>
                <p className="font-serif text-accent font-bold text-lg leading-none">
                  <Counter target={500} />
                </p>
                <p className="font-sans text-xs text-gray-500 mt-0.5">Active Members</p>
              </div>
            </div>

            {/* TEXT */}
            <div className={`fade-right ${whoVisible ? "visible" : ""} d2`}>
              <div className="w-10 h-0.5 bg-gradient-to-r from-accent to-purple-500 mb-4 rounded-full"></div>
              <p className="font-sans text-accent text-sm font-semibold mb-2 tracking-widest uppercase">
                Who We Are
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary mb-4 leading-tight">
                More than a chapter. <br />
                <span className="text-accent font-accentFont">A movement.</span>
              </h2>
              <p className="font-sans text-gray-800 mb-6 leading-relaxed">
                The IEEE WIE Student Branch Affinity Group fosters leadership,
                mentorship, and networking opportunities.
              </p>
              <button className="btn-outline"><a href="/about">Explore More</a></button>
            </div>
          </div>
        </section>


        <HomeEventsSection
          events={events}
          loading={loading}
          sectionRef={eventsRef}
          visible={eventsVisible}
        />

      </div>
    </>
  );
};

export default Home;