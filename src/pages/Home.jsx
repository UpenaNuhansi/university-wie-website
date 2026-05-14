import React, { useEffect, useRef, useState } from "react";
import hero from "../assets/home/hero.png";
import secondimg from "../assets/home/home-pg-2.jpg";
import useFetchEvents from "../hooks/useFetchEvents";
import { formatDate } from "../utils/formatDate";

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

  /* get upcoming events (next 3) */
  const upcomingEvents = events
    .filter(event => new Date(event.date) >= new Date())
    .slice(0, 3);

  return (
    <>
      <style>{`
        /* ── Google Fonts ── */
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500&display=swap');

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

        /* ── hero heading font ── */
        .font-display { font-family: 'Cormorant Garamond', serif; }
        .font-body    { font-family: 'DM Sans', sans-serif; }

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
          border: 1.5px solid #7c3aed;
          padding: 0.625rem 1.5rem;
          border-radius: 0.5rem;
          color: #7c3aed;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          background: transparent;
          cursor: pointer;
          transition: background 0.25s, color 0.25s, transform 0.22s;
        }
        .btn-outline:hover { background: #ede9fe; transform: translateY(-1px); }

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

        /* ── event cards ── */
        .event-big {
          background: linear-gradient(135deg, #3b0764 0%, #1e0538 60%, #0f0218 100%);
          color: #fff;
          padding: 2rem;
          border-radius: 1.1rem;
          position: relative;
          overflow: hidden;
          transition: transform 0.35s cubic-bezier(.22,1,.36,1), box-shadow 0.35s ease;
        }
        .event-big::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 180px; height: 180px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(219,39,119,0.25) 0%, transparent 70%);
          pointer-events: none;
        }
        .event-big:hover { transform: translateY(-5px); box-shadow: 0 18px 48px rgba(60,0,100,0.35); }

        .event-card {
          background: #fff;
          padding: 1.5rem;
          border-radius: 1.1rem;
          box-shadow: 0 2px 16px rgba(80,0,120,0.07);
          transition: transform 0.32s cubic-bezier(.22,1,.36,1), box-shadow 0.32s ease;
          position: relative;
          overflow: hidden;
        }
        .event-card::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #7c3aed, #db2777);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.35s ease;
        }
        .event-card:hover { transform: translateY(-5px); box-shadow: 0 14px 36px rgba(80,0,120,0.14); }
        .event-card:hover::after { transform: scaleX(1); }

        .event-cta {
          background: linear-gradient(135deg, #5b21b6 0%, #4c1d95 100%);
          color: #fff;
          padding: 1.5rem;
          border-radius: 1.1rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          gap: 1rem;
          transition: transform 0.32s ease, box-shadow 0.32s ease;
          position: relative;
          overflow: hidden;
        }
        .event-cta::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 60% 30%, rgba(219,39,119,0.18) 0%, transparent 65%);
          pointer-events: none;
        }
        .event-cta:hover { transform: translateY(-4px); box-shadow: 0 14px 40px rgba(76,29,149,0.32); }

        .btn-white {
          background: #fff;
          color: #5b21b6;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          padding: 0.6rem 1.4rem;
          border-radius: 0.45rem;
          border: none;
          cursor: pointer;
          transition: background 0.22s, transform 0.22s;
          box-shadow: 0 2px 10px rgba(0,0,0,0.12);
        }
        .btn-white:hover { background: #f3f4f6; transform: scale(1.04); }

        /* ── register button ── */
        .btn-ghost {
          border: 1.5px solid rgba(255,255,255,0.7);
          color: #fff;
          padding: 0.6rem 1.4rem;
          border-radius: 0.45rem;
          background: transparent;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          cursor: pointer;
          transition: background 0.25s, color 0.25s, transform 0.22s;
          margin-top: 1rem;
        }
        .btn-ghost:hover { background: #fff; color: #1e0538; transform: translateY(-1px); }

        /* ── pink link ── */
        .pink-link {
          color: #db2777;
          font-size: 0.875rem;
          font-family: 'DM Sans', sans-serif;
          text-decoration: none;
          position: relative;
          display: inline-block;
        }
        .pink-link::after {
          content: '';
          position: absolute;
          left: 0; bottom: -1px;
          width: 0; height: 1px;
          background: #db2777;
          transition: width 0.28s ease;
        }
        .pink-link:hover::after { width: 100%; }

        /* ── decorative grain overlay on sections ── */
        .grain::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          mix-blend-mode: multiply;
        }

        /* ── hero tag pulse ── */
        .tag-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #6b7280;
          font-family: 'DM Sans', sans-serif;
          margin-bottom: 0.6rem;
        }
        .tag-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #db2777;
          animation: pulse-dot 1.8s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%,100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.5; transform: scale(1.5); }
        }

        /* ── section divider line ── */
        .accent-line {
          width: 2.5rem;
          height: 2px;
          background: linear-gradient(90deg, #db2777, #7c3aed);
          border-radius: 2px;
          margin-bottom: 0.75rem;
        }
      `}</style>

      <div className="w-full font-body">

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

                <div className="tag-pill">
                  <span className="tag-dot"></span>
                  Empowering Women in STEM
                </div>

                <h1 className={`font-display text-2xl sm:text-3xl md:text-4xl font-bold text-primary leading-tight mb-4 fade-up ${heroReady ? "visible" : ""} d2`}>
                  Inspiring the Next Generation of Female Engineers
                </h1>

                <p className={`font-body text-gray-800 text-sm mb-6 fade-up ${heroReady ? "visible" : ""} d3`}>
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
        <section className="bg-purple-100 py-16 md:py-20 relative" style={{ position: "relative" }}>
          <div ref={whoRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10 items-center">

            {/* IMAGE */}
            <div className={`relative fade-left ${whoVisible ? "visible" : ""} d1`}>
              <img
                src={secondimg}
                alt="who we are"
                className="img-lift rounded-xl shadow-lg w-full"
              />
              <div className={`stat-badge -top-4 -left-4 hidden sm:block fade-up ${whoVisible ? "visible" : ""} d3`}>
                <p className="font-display text-pink-600 font-bold text-lg leading-none">
                  <Counter target={50} />
                </p>
                <p className="font-body text-xs text-gray-500 mt-0.5">Events Hosted</p>
              </div>
              <div className={`stat-badge -bottom-4 right-4 hidden sm:block fade-up ${whoVisible ? "visible" : ""} d4`}>
                <p className="font-display text-pink-600 font-bold text-lg leading-none">
                  <Counter target={500} />
                </p>
                <p className="font-body text-xs text-gray-500 mt-0.5">Active Members</p>
              </div>
            </div>

            {/* TEXT */}
            <div className={`fade-right ${whoVisible ? "visible" : ""} d2`}>
              <div className="accent-line"></div>
              <p className="font-body text-pink-600 text-sm font-semibold mb-2 tracking-widest uppercase">
                Who We Are
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-purple-900 mb-4 leading-tight">
                More than a chapter. <br />
                <span className="text-pink-600 italic">A movement.</span>
              </h2>
              <p className="font-body text-gray-600 mb-6 leading-relaxed">
                The IEEE WIE Student Branch Affinity Group fosters leadership,
                mentorship, and networking opportunities.
              </p>
              <button className="btn-outline">Explore More</button>
            </div>
          </div>
        </section>


        {/* ================= EVENTS ================= */}
        <section className="bg-purple-100 pb-16 md:pb-20">
          <div ref={eventsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className={`mb-10 fade-up ${eventsVisible ? "visible" : ""} d1`}>
              <div className="accent-line"></div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-purple-900 mb-2">
                Where ideas meet <span className="text-pink-600 italic">momentum</span>
              </h2>
              <p className="font-body text-sm text-pink-600">
                Join sessions designed to challenge and elevate your career.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">

              {/* BIG CARD - First Event */}
              {!loading && upcomingEvents.length > 0 ? (
                <div className={`event-big md:col-span-2 fade-up ${eventsVisible ? "visible" : ""} d2`}>
                  <p className="font-body text-xs text-purple-300 mb-2 tracking-widest uppercase">{formatDate(upcomingEvents[0].date)}</p>
                  <h3 className="font-display text-xl sm:text-2xl font-semibold mb-1 leading-snug">
                    {upcomingEvents[0].title}
                  </h3>
                  <a href={`/events/${upcomingEvents[0].id}`} className="btn-ghost">View Details</a>
                </div>
              ) : (
                <div className={`event-big md:col-span-2 fade-up ${eventsVisible ? "visible" : ""} d2`}>
                  <p className="font-body text-xs text-purple-300 mb-2 tracking-widest uppercase">No upcoming events</p>
                </div>
              )}

              {/* SIDE CARD - Second Event */}
              {!loading && upcomingEvents.length > 1 ? (
                <div className={`event-card fade-up ${eventsVisible ? "visible" : ""} d3`}>
                  <p className="font-body text-sm text-gray-400 mb-2">{formatDate(upcomingEvents[1].date)}</p>
                  <h3 className="font-display text-lg font-semibold text-purple-900 mb-2">
                    {upcomingEvents[1].title}
                  </h3>
                  <a href={`/events/${upcomingEvents[1].id}`} className="pink-link">View Details →</a>
                </div>
              ) : (
                <div className={`event-card fade-up ${eventsVisible ? "visible" : ""} d3`}>
                  <p className="font-body text-sm text-gray-400 mb-2">No event</p>
                </div>
              )}

              {/* SMALL - Third Event */}
              {!loading && upcomingEvents.length > 2 ? (
                <div className={`event-card fade-up ${eventsVisible ? "visible" : ""} d4`}>
                  <p className="font-body text-sm text-gray-400 mb-2">{formatDate(upcomingEvents[2].date)}</p>
                  <h3 className="font-display text-lg font-semibold text-purple-900 mb-2">
                    {upcomingEvents[2].title}
                  </h3>
                  <a href={`/events/${upcomingEvents[2].id}`} className="pink-link">View Details →</a>
                </div>
              ) : (
                <div className={`event-card fade-up ${eventsVisible ? "visible" : ""} d4`}>
                  <p className="font-body text-sm text-gray-400 mb-2">No event</p>
                </div>
              )}

              {/* CTA */}
              <div className={`event-cta md:col-span-2 fade-up ${eventsVisible ? "visible" : ""} d5`}>
                <h3 className="font-display text-xl font-semibold">
                  Have an idea for an event?
                </h3>
                <button className="btn-white"><a href="/contactus">Propose Idea</a></button>
              </div>

            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default Home;