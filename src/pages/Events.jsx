import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { getEvents } from "../services/eventService";
import { useNavigate } from "react-router-dom";
import { useInView } from "../hooks/useInView";

function Meta({ icon, text }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-800 font-sans">
      <span className="text-base shrink-0">{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function formatClockTime(timeValue) {
  if (!timeValue) return "";
  if (typeof timeValue === "string" && /^\d{2}:\d{2}$/.test(timeValue)) {
    const [hours, minutes] = timeValue.split(":").map(Number);
    const d = new Date();
    d.setHours(hours, minutes, 0, 0);
    return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  }
  const d = new Date(timeValue);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
}

function getEventTimeText(event) {
  if (event.startTime && event.endTime) {
    return `${formatClockTime(event.startTime)} - ${formatClockTime(event.endTime)}`;
  }
  if (event.startTime) return formatClockTime(event.startTime);
  if (event.time) return event.time;
  if (event.date) {
    const fallback = formatClockTime(event.date);
    if (fallback) return fallback;
  }
  return "Time TBA";
}

function SectionHeading({ children, visible }) {
  return (
    <div className="relative inline-block">
      <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary leading-tight tracking-tight">
        {children}
      </h2>
      <div 
        className={`absolute -bottom-1.5 left-0 right-0 h-0.5 bg-gradient-to-r from-accent to-purple-500 rounded-full transition-all duration-700 ease-out origin-left ${visible ? 'scale-x-100' : 'scale-x-0'}`} 
      />
    </div>
  );
}

function UpcomingCard({ event, index, onClick }) {
  const [ref, visible] = useInView(0.12);
  const isComingSoon = !event.date && (event.comingSoon || event.image);
  const eventDate = event.date ? new Date(event.date) : null;
  const day = eventDate ? eventDate.getDate() : null;
  const month = eventDate ? eventDate.toLocaleDateString("en-US", { month: "short" }) : null;
  const registrationLink = event.registrationLink || event.registerLink;
  const registrationLabel = event.registrationLabel || (event.registrationType === "google" ? "Open Google Form" : "Register Now");
  const eventTimeText = getEventTimeText(event);

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`bg-white rounded-3xl border border-purple-100 shadow-sm hover:shadow-xl hover:shadow-purple-200/50 transition-all duration-500 overflow-hidden flex flex-col group cursor-pointer ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
      style={{ transitionDelay: `${index * 90}ms` }}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-video">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-purpleDark/50 via-transparent to-transparent opacity-70" />

        {/* Date Badge */}
        <div className="absolute top-4 left-4 bg-purple-900/95 backdrop-blur-sm border border-purple-800 text-white rounded-2xl p-3 text-center min-w-[64px] shadow-lg shadow-purple-900/20">
          {isComingSoon ? (
            <div className="text-[10px] font-bold tracking-widest font-sans">COMING SOON</div>
          ) : (
            <>
              <div className="text-2xl font-bold font-serif leading-none">{day}</div>
              <div className="text-[10px] font-semibold tracking-wider font-sans mt-1 uppercase text-pink-300">{month}</div>
            </>
          )}
        </div>

        {/* Type Badges */}
        <div className="absolute bottom-4 left-4 flex gap-2 flex-wrap">
          {event.eventType && (
            <span className="bg-accent/90 backdrop-blur-md text-white text-[10px] font-bold tracking-wider px-3 py-1 rounded-full font-sans uppercase">
              {event.eventType}
            </span>
          )}
          {event.format && (
            <span className="bg-white/10 backdrop-blur-md text-white border border-white/20 text-[10px] font-semibold tracking-wider px-3 py-1 rounded-full font-sans uppercase">
              {event.format}
            </span>
          )}
        </div>
      </div>

      {/* Body Container */}
      <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-serif text-xl md:text-2xl font-bold text-primary mb-3 leading-snug group-hover:text-accent transition-colors duration-300">
            {event.title}
          </h3>

          <div className="flex flex-col gap-2 mb-4">
            <Meta icon="🕐" text={eventTimeText} />
            <Meta icon="📍" text={event.location} />
          </div>

          <p className="text-gray-800 text-sm leading-relaxed mb-6 font-sans line-clamp-3">
            {event.description}
          </p>
        </div>

        {registrationLink ? (
          <a
            href={registrationLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="w-full py-3 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-center font-sans text-sm shadow-md shadow-purple-200/50 block cursor-pointer"
          >
            {registrationLabel} →
          </a>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            className="w-full py-3 bg-transparent border-2 border-primary text-primary font-bold rounded-2xl hover:bg-primary hover:text-white transition-all duration-300 font-sans text-sm active:scale-95 cursor-pointer"
          >
            View Details →
          </button>
        )}
      </div>
    </div>
  );
}

function PastCard({ event, index, onClick }) {
  const [ref, visible] = useInView(0.12);
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  }).toUpperCase();
  const registrationLink = event.registrationLink || event.registerLink;
  const registrationLabel = event.registrationLabel || (event.registrationType === "google" ? "Open Google Form" : "Register Now");

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`bg-white rounded-3xl border border-purple-100 shadow-sm hover:shadow-xl hover:shadow-purple-200/50 transition-all duration-500 overflow-hidden flex flex-col group cursor-pointer ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
      style={{ transitionDelay: `${index * 75}ms` }}
    >
      <div className="relative overflow-hidden aspect-video">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03] grayscale-[20%] group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-purpleDark/50 via-transparent to-transparent opacity-70" />
        
        <div className="absolute bottom-4 left-4 bg-purpleDark/80 backdrop-blur-sm px-3 py-1 rounded-full border border-purple-700/50">
          <span className="text-[10px] font-bold tracking-widest text-pink-300 font-sans uppercase">{formattedDate}</span>
        </div>
      </div>

      <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-serif text-xl md:text-2xl font-bold text-primary mb-3 leading-snug group-hover:text-accent transition-colors duration-300">
            {event.title}
          </h3>

          <p className="text-gray-800 text-sm leading-relaxed mb-4 font-sans line-clamp-3">
            {event.description}
          </p>

          <div className="flex gap-4 flex-wrap mb-6">
            {event.youtubeLink && (
              <a
                href={event.youtubeLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-sm font-bold text-accent hover:text-primary transition-colors font-sans"
              >
                ▶ View Recap
              </a>
            )}
            {event.facebookLink && (
              <a
                href={event.facebookLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-primary transition-colors font-sans"
              >
                f Facebook
              </a>
            )}
          </div>
        </div>

        {registrationLink ? (
          <a
            href={registrationLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="w-full py-3 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-center font-sans text-sm shadow-md shadow-purple-200/50 block cursor-pointer"
          >
            {registrationLabel} →
          </a>
        ) : (
          <button
            className="w-full py-3 bg-transparent border-2 border-primary text-primary font-bold rounded-2xl hover:bg-primary hover:text-white transition-all duration-300 font-sans text-sm active:scale-95 cursor-pointer"
            onClick={(e) => { e.stopPropagation(); onClick(); }}
          >
            View Details →
          </button>
        )}
      </div>
    </div>
  );
}

export default function Events() {
  const [events, setEvents]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [heroReady, setHeroReady] = useState(false);
  const [upcomingRef, upcomingVisible] = useInView(0.05);
  const [pastRef, pastVisible]         = useInView(0.05);
  const [ctaRef, ctaVisible]           = useInView(0.1);
  const [showMorePastEvents, setShowMorePastEvents] = useState(false);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const navigate = useNavigate();

  const getWeekStart = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const groupEventsByWeek = (eventsList) => {
    const weeks = {};
    const comingSoon = [];

    eventsList.forEach(event => {
      if (!event.date) {
        comingSoon.push(event);
        return;
      }

      const weekStart = getWeekStart(event.date);
      const weekKey = weekStart.toISOString().split('T')[0];
      if (!weeks[weekKey]) weeks[weekKey] = { start: weekStart, events: [] };
      weeks[weekKey].events.push(event);
    });

    const sorted = Object.values(weeks).sort((a, b) => a.start - b.start);
    if (comingSoon.length) sorted.unshift({ start: null, events: comingSoon });
    return sorted;
  };

  useEffect(() => {
    const timer = setTimeout(() => setHeroReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loader />;

  const now = new Date();
  const isComingSoonEvent = (e) => !e.date && (e.comingSoon || e.image);

  const upcoming = events.filter(e => (e.date ? new Date(e.date) > now : isComingSoonEvent(e)));
  const past     = events.filter(e => e.date && new Date(e.date) <= now);
  const upcomingWeeks = groupEventsByWeek(upcoming);
  const currentWeekEvents = upcomingWeeks[currentWeekIndex]?.events || [];

  return (
    <div className="bg-purpleLight min-h-screen font-sans pt-6 pb-12 overflow-x-hidden">
      {/* Hero Section */}
      <section className="bg-purpleLight py-16 md:py-24 px-6 text-center overflow-hidden relative">
        <div className="absolute top-[-60px] left-[-80px] w-[380px] h-[380px] bg-radial-gradient(circle, rgba(147,51,234,0.12) 0%, transparent 70%) rounded-full pointer-events-none animate-pulse" />
        <div className="absolute bottom-[-40px] right-[-60px] w-[300px] h-[300px] bg-radial-gradient(circle, rgba(219,39,119,0.1) 0%, transparent 70%) rounded-full pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="max-w-4xl mx-auto">
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-purple-100 shadow-sm mb-8 transition-all duration-1000 ${heroReady ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></div>
            <span className="text-[10px] md:text-xs font-semibold tracking-widest text-primary/80 uppercase font-sans">
              Empowering Women in STEM
            </span>
          </div>
          
          <h1 className={`text-3xl md:text-6xl font-bold text-primary mb-8 leading-tight font-serif transition-all duration-1000 delay-200 ${heroReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Discover Our <span className="text-accent font-accentFont">Events</span>
          </h1>
          
          <p className={`text-gray-800 text-base md:text-xl leading-relaxed max-w-2xl mx-auto font-medium transition-all duration-1000 delay-500 ${heroReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Join us for workshops, technical sessions, and networking opportunities designed to elevate your professional journey in technology and engineering.
          </p>

          <div className={`w-12 h-0.5 bg-gradient-to-r from-accent to-purple-500 rounded-full mx-auto mt-8 transition-all duration-1000 delay-700 ${heroReady ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}></div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="max-w-7xl mx-auto py-12 md:py-20 px-6">
        <div 
          ref={upcomingRef}
          className={`flex justify-between items-end mb-8 md:mb-12 flex-wrap gap-4 transition-all duration-1000 ${upcomingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div>
            <SectionHeading visible={upcomingVisible}>Upcoming Events</SectionHeading>
            {upcomingWeeks.length > 0 && currentWeekEvents.length > 0 && (
              <p className="text-gray-500 text-xs md:text-sm mt-3 font-sans font-medium uppercase tracking-wider">
                {upcomingWeeks[currentWeekIndex].start
                  ? `Week of ${upcomingWeeks[currentWeekIndex].start.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
                  : 'Coming Soon'}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            {["←", "→"].map((arrow, i) => {
              const isDisabled = upcomingWeeks.length <= 1 ||
                (arrow === "←" && currentWeekIndex === 0) ||
                (arrow === "→" && currentWeekIndex === upcomingWeeks.length - 1);
              return (
                <button
                  key={i}
                  disabled={isDisabled}
                  onClick={() => {
                    if (arrow === "←") setCurrentWeekIndex(Math.max(0, currentWeekIndex - 1));
                    else setCurrentWeekIndex(Math.min(upcomingWeeks.length - 1, currentWeekIndex + 1));
                  }}
                  className={`w-11 h-11 rounded-full border border-purple-200 flex items-center justify-center font-sans text-base transition-all duration-300 shadow-sm
                    ${isDisabled 
                      ? 'bg-gray-100 text-gray-400 cursor-default' 
                      : 'bg-white text-primary hover:bg-primary hover:text-white hover:border-primary active:scale-90 cursor-pointer'}`}
                >
                  {arrow}
                </button>
              );
            })}
          </div>
        </div>

        {upcoming.length === 0 ? (
          <p className="text-gray-500 italic text-center py-12 font-sans font-medium">
            No upcoming events at the moment. Check back soon!
          </p>
        ) : currentWeekEvents.length === 0 ? (
          <p className="text-gray-500 italic text-center py-12 font-sans font-medium">
            No events this week.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {currentWeekEvents.map((event, i) => (
              <UpcomingCard
                key={event.id}
                event={event}
                index={i}
                onClick={() => navigate(`/events/${event.id}`)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent" />
      </div>

      {/* Past Events Section */}
      <section className="max-w-7xl mx-auto py-12 md:py-20 px-6">
        <div 
          ref={pastRef}
          className={`mb-8 md:mb-12 transition-all duration-1000 ${pastVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <SectionHeading visible={pastVisible}>Past Events</SectionHeading>
        </div>

        {past.length === 0 ? (
          <p className="text-gray-500 italic text-center py-12 font-sans font-medium">
            No past events yet.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {past.slice(0, showMorePastEvents ? past.length : 4).map((event, i) => (
                <PastCard
                  key={event.id}
                  event={event}
                  index={i}
                  onClick={() => navigate(`/events/${event.id}`)}
                />
              ))}
            </div>

            {past.length > 4 && (
              <div className="flex justify-center mt-12 md:mt-16">
                <button
                  onClick={() => setShowMorePastEvents(!showMorePastEvents)}
                  className="px-10 py-3 bg-transparent border-2 border-primary text-primary font-bold rounded-2xl hover:bg-primary hover:text-white transition-all duration-300 font-sans text-sm active:scale-95 cursor-pointer shadow-sm hover:shadow-lg shadow-purple-200/50"
                >
                  {showMorePastEvents ? "Show Less" : "Load More Events"}
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent" />
      </div>

      {/* Idea / CTA Section */}
      <section className="max-w-7xl mx-auto py-12 md:py-16 px-6">
        <div 
          ref={ctaRef}
          className={`bg-gradient-to-r from-primary to-accent rounded-[2.5rem] md:rounded-[3rem] p-10 md:p-16 text-white text-left shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 transition-all duration-1000 ${ctaVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        >
          {/* BG decorative blobs */}
          <div className="absolute top-[-40px] right-[-40px] w-[220px] h-[220px] bg-radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%) rounded-full pointer-events-none animate-pulse" />
          <div className="absolute bottom-[-30px] left-[30%] w-[160px] h-[160px] bg-radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%) rounded-full pointer-events-none animate-pulse" style={{ animationDelay: '1.5s' }} />

          <div className="max-w-xl relative z-10">
            <h3 className="font-serif text-2xl md:text-4xl font-bold mb-4 leading-tight">
              Have an idea for our next event?
            </h3>
            <p className="text-white/80 text-sm md:text-base leading-relaxed font-sans font-medium">
              We're always looking for fresh perspectives and innovative topics. Propose a workshop, guest speaker, or technical session to share with our community.
            </p>
          </div>

          <button
            onClick={() => navigate("/contact")}
            className="px-10 py-4 bg-white text-accent font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl font-sans shrink-0 flex items-center gap-2 cursor-pointer z-10 text-sm md:text-base"
          >
            Propose an Event 💡
          </button>
        </div>
      </section>
    </div>
  );
}