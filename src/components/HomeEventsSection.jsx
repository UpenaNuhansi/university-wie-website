import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { formatDate } from '../utils/formatDate';

const isComingSoonEvent = (event) =>
  !event.date && (event.comingSoon || event.image);

function getEventDateParts(event) {
  if (!event.date) return null;
  const date = new Date(event.date);
  if (Number.isNaN(date.getTime())) return null;
  return {
    day: date.getDate(),
    month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    full: formatDate(event.date),
  };
}

function EventImage({ event, className = '' }) {
  if (event.image) {
    return (
      <img
        src={event.image}
        alt={event.title}
        className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${className}`}
      />
    );
  }

  return (
    <div className={`w-full h-full bg-gradient-to-br from-primary to-purpleDark flex items-center justify-center ${className}`}>
      <Icon icon="lucide:calendar-days" className="text-white/25 text-5xl md:text-6xl" />
    </div>
  );
}

function DateBadge({ event, className = '' }) {
  const comingSoon = isComingSoonEvent(event);
  const parts = getEventDateParts(event);

  return (
    <div
      className={`absolute top-4 left-4 z-10 text-white text-center shadow-lg ${
        comingSoon
          ? 'bg-gradient-to-r from-accent to-purple-500 rounded-xl px-3 py-2 min-w-[72px]'
          : 'bg-primary rounded-xl px-3 py-2 min-w-[64px]'
      } ${className}`}
    >
      {comingSoon ? (
        <span className="text-[10px] font-bold tracking-widest uppercase font-sans">Soon</span>
      ) : parts ? (
        <>
          <div className="font-serif text-2xl font-bold leading-none">{parts.day}</div>
          <div className="text-[10px] font-semibold tracking-widest mt-0.5 opacity-90 font-sans">{parts.month}</div>
        </>
      ) : (
        <span className="text-[10px] font-bold tracking-widest uppercase font-sans">TBA</span>
      )}
    </div>
  );
}

function FeaturedEventCard({ event, visible, delayClass, wide = true }) {
  const parts = getEventDateParts(event);
  const dateLabel = isComingSoonEvent(event) ? 'Coming Soon' : parts?.full || 'Date TBA';

  return (
    <Link
      to={`/events/${event.id}`}
      className={`group ${wide ? 'lg:col-span-2' : ''} flex flex-col md:flex-row bg-white rounded-3xl border border-purple-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-purple-200/40 transition-all duration-500 fade-up ${visible ? 'visible' : ''} ${delayClass}`}
    >
      <div className="relative md:w-[42%] min-h-[220px] md:min-h-[280px] overflow-hidden">
        <EventImage event={event} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/10 pointer-events-none" />
        <DateBadge event={event} />
      </div>

      <div className="flex flex-col justify-center p-6 md:p-8 md:w-[58%]">
        <p className="text-xs font-semibold tracking-widest uppercase text-accent font-sans mb-3">
          Featured Event
        </p>
        <h3 className="font-serif text-2xl md:text-3xl font-bold text-primary leading-tight mb-3 group-hover:text-accent transition-colors">
          {event.title}
        </h3>
        <p className="flex items-center gap-2 text-sm text-gray-500 font-sans mb-4">
          <Icon icon="lucide:calendar" className="text-accent shrink-0" />
          {dateLabel}
        </p>
        {event.description && (
          <p className="text-gray-800 text-sm md:text-base leading-relaxed line-clamp-3 font-sans mb-6">
            {event.description}
          </p>
        )}
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent font-sans group-hover:gap-3 transition-all">
          View Details
          <Icon icon="lucide:arrow-right" className="text-base" />
        </span>
      </div>
    </Link>
  );
}

function CompactEventCard({ event, visible, delayClass }) {
  const parts = getEventDateParts(event);
  const dateLabel = isComingSoonEvent(event) ? 'Coming Soon' : parts?.full || 'Date TBA';

  return (
    <Link
      to={`/events/${event.id}`}
      className={`group flex flex-col bg-white rounded-3xl border border-purple-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-purple-200/40 transition-all duration-500 fade-up ${visible ? 'visible' : ''} ${delayClass}`}
    >
      <div className="relative h-44 overflow-hidden">
        <EventImage event={event} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent pointer-events-none" />
        <DateBadge event={event} className="top-3 left-3" />
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-serif text-lg font-bold text-primary leading-snug mb-2 group-hover:text-accent transition-colors line-clamp-2">
          {event.title}
        </h3>
        <p className="text-xs text-gray-500 font-sans mb-4">{dateLabel}</p>
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent font-sans mt-auto group-hover:gap-2.5 transition-all">
          View Details
          <Icon icon="lucide:arrow-right" className="text-sm" />
        </span>
      </div>
    </Link>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 rounded-3xl border border-purple-100 bg-white overflow-hidden animate-pulse">
        <div className="h-[220px] md:h-[280px] bg-purple-100/60" />
        <div className="p-6 md:p-8 space-y-3">
          <div className="h-3 w-24 bg-purple-100 rounded" />
          <div className="h-7 w-3/4 bg-purple-100 rounded" />
          <div className="h-4 w-1/3 bg-purple-100 rounded" />
          <div className="h-16 w-full bg-purple-100/60 rounded" />
        </div>
      </div>
      <div className="flex flex-col gap-6">
        {[0, 1].map((i) => (
          <div key={i} className="rounded-3xl border border-purple-100 bg-white overflow-hidden animate-pulse">
            <div className="h-44 bg-purple-100/60" />
            <div className="p-5 space-y-3">
              <div className="h-5 w-2/3 bg-purple-100 rounded" />
              <div className="h-3 w-1/3 bg-purple-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState({ visible, delayClass }) {
  return (
    <div
      className={`bg-white rounded-3xl border border-purple-100 p-8 md:p-12 text-center shadow-sm fade-up ${visible ? 'visible' : ''} ${delayClass}`}
    >
      <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-purpleLight border border-purple-100 flex items-center justify-center">
        <Icon icon="lucide:calendar-clock" className="text-accent text-3xl" />
      </div>
      <h3 className="font-serif text-2xl md:text-3xl font-bold text-primary mb-3">
        No upcoming events yet
      </h3>
      <p className="text-gray-800 font-sans max-w-md mx-auto mb-8 leading-relaxed">
        New workshops, talks, and sessions are added regularly. Check back soon or browse our past events.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/events"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-primary text-primary font-sans text-sm font-medium hover:bg-purple-50 transition-colors"
        >
          Browse Events
        </Link>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-white font-sans text-sm font-medium hover:shadow-lg hover:shadow-accent/30 transition-all"
        >
          Propose an Idea
        </Link>
      </div>
    </div>
  );
}

function ProposeBanner({ visible, delayClass }) {
  return (
    <div
      className={`mt-8 rounded-3xl bg-gradient-to-br from-primary via-primary to-purpleDark p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5 relative overflow-hidden fade-up ${visible ? 'visible' : ''} ${delayClass}`}
    >
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full bg-accent/20 blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"
        aria-hidden="true"
      />
      <div className="relative z-10">
        <h3 className="font-serif text-xl md:text-2xl font-bold text-white mb-1">
          Have an idea for an event?
        </h3>
        <p className="text-purple-200 text-sm font-sans">
          Share your workshop or session idea with our team.
        </p>
      </div>
      <Link
        to="/contact"
        className="relative z-10 inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-white text-primary font-sans text-sm font-semibold hover:bg-purple-50 transition-colors shrink-0"
      >
        Propose Idea
        <Icon icon="lucide:arrow-right" className="text-base" />
      </Link>
    </div>
  );
}

export default function HomeEventsSection({ events, loading, sectionRef, visible }) {
  const now = new Date();
  const upcomingEvents = [...events]
    .filter((event) => (event.date ? new Date(event.date) > now : isComingSoonEvent(event)))
    .sort((a, b) => {
      const aTime = a.date ? new Date(a.date).getTime() : Number.MAX_SAFE_INTEGER;
      const bTime = b.date ? new Date(b.date).getTime() : Number.MAX_SAFE_INTEGER;
      return aTime - bTime;
    })
    .slice(0, 3);

  const sideEvents = upcomingEvents.slice(1);

  return (
    <section className="bg-purpleLight py-16 md:py-20">
      <div ref={sectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 fade-up ${visible ? 'visible' : ''} d1`}>
          <div>
            <div className="w-10 h-0.5 bg-gradient-to-r from-accent to-purple-500 mb-4 rounded-full" />
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary mb-2">
              Where ideas meet <span className="text-accent font-accentFont">momentum</span>
            </h2>
            <p className="font-sans text-sm text-accent">
              Join sessions designed to challenge and elevate your career.
            </p>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary font-sans hover:text-accent transition-colors shrink-0"
          >
            View all events
            <Icon icon="lucide:arrow-right" className="text-base" />
          </Link>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : upcomingEvents.length === 0 ? (
          <EmptyState visible={visible} delayClass="d2" />
        ) : (
          <div className={`grid gap-6 ${sideEvents.length > 0 ? 'lg:grid-cols-3' : ''}`}>
            <FeaturedEventCard
              event={upcomingEvents[0]}
              visible={visible}
              delayClass="d2"
              wide={sideEvents.length > 0}
            />
            {sideEvents.length > 0 && (
              <div className="flex flex-col gap-6">
                {sideEvents.map((event, index) => (
                  <CompactEventCard
                    key={event.id}
                    event={event}
                    visible={visible}
                    delayClass={index === 0 ? 'd3' : 'd4'}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {!loading && <ProposeBanner visible={visible} delayClass="d5" />}
      </div>
    </section>
  );
}
