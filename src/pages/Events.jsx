import { useEffect, useState } from "react";
import { getEvents } from "../services/eventService";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../utils/formatDate";

export default function Events() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const data = await getEvents();
    setEvents(data);
  };

  const upcoming = events.filter(e => new Date(e.date) > new Date());
  const past = events.filter(e => new Date(e.date) <= new Date());

  const getDateDay = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.getDate();
    } catch {
      return "";
    }
  };

  const getDateMonth = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch {
      return "";
    }
  };

  return (
    <div className="bg-[#f6eef7] font-body">

      {/* HERO */}
      <section className="py-20 text-center bg-gradient-to-b from-purple-100 to-[#f6eef7]">
        <div className="mb-4">
          <span className="inline-block bg-purple-800 text-white px-4 py-1 rounded-full text-xs font-semibold tracking-widest">
            EMPOWERING WOMEN IN STEM
          </span>
        </div>
        <h1 className="text-5xl font-bold text-purple-900 mb-4">
          Discover Our Events
        </h1>
        <p className="text-gray-700 max-w-2xl mx-auto">
          Join us for workshops, technical sessions, and networking opportunities
          designed to elevate your professional journey in technology and engineering.
        </p>
      </section>

      {/* UPCOMING */}
      <section className="px-6 md:px-16 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-purple-900">Upcoming Events</h2>
          <div className="flex gap-2">
            <button className="text-purple-600 font-bold text-xl">←</button>
            <button className="text-purple-600 font-bold text-xl">→</button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {upcoming.map((event) => {
            const eventDate = new Date(event.date);
            const day = eventDate.getDate();
            
            return (
              <div
                key={event.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => navigate(`/events/${event.id}`)}
              >
                <div className="relative">
                  <img
                    src={event.image}
                    className="h-64 w-full object-cover"
                    alt={event.title}
                  />
                  <div className="absolute top-4 left-4 bg-purple-700 text-white rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold">{day}</div>
                    <div className="text-xs">{eventDate.toLocaleDateString('en-US', { month: 'short' })}</div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex gap-2 mb-3">
                    {event.eventType && (
                      <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded text-xs font-semibold">
                        {event.eventType}
                      </span>
                    )}
                    {event.format && (
                      <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded text-xs font-semibold">
                        {event.format}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-purple-900 mb-2">{event.title}</h3>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <span>🕐</span>
                    <span>{event.time || "09:00 AM - 04:00 PM UKT"}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <span>📍</span>
                    <span>{event.location}</span>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  {event.allowRegister && event.registerLink ? (
                    <a
                      href={event.registerLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block w-full text-center bg-pink-600 text-white px-4 py-2 rounded font-semibold hover:bg-pink-700 transition"
                    >
                      Register Now →
                    </a>
                  ) : (
                    <button className="w-full bg-gray-200 text-gray-600 px-4 py-2 rounded font-semibold">
                      Register Now →
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* PAST */}
      <section className="px-6 md:px-16 py-12">
        <h2 className="text-3xl font-bold text-purple-900 mb-8">Past Events</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {past.map((event) => {
            const eventDate = new Date(event.date);
            const formattedDate = eventDate.toLocaleDateString('en-US', { 
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }).toUpperCase();
            
            return (
              <div
                key={event.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => navigate(`/events/${event.id}`)}
              >
                <img 
                  src={event.image} 
                  className="h-64 w-full object-cover"
                  alt={event.title}
                />

                <div className="p-6">
                  <p className="text-xs text-gray-500 font-semibold mb-2">{formattedDate}</p>
                  <h3 className="text-xl font-bold text-purple-900 mb-3">{event.title}</h3>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  {event.youtubeLink && (
                    <a
                      href={event.youtubeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 font-semibold hover:text-pink-700 transition"
                    >
                      View Recap →
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center mt-12">
          <button className="border-2 border-purple-900 text-purple-900 px-8 py-2 rounded font-semibold hover:bg-purple-900 hover:text-white transition">
            Load More Events
          </button>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-16 py-16">
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-12 rounded-2xl flex justify-between items-center">
          <div>
            <h3 className="text-3xl font-bold text-purple-900 mb-2">
              Have an idea for our next event?
            </h3>
            <p className="text-gray-700">
              We are always looking for fresh perspectives and innovative topics.
              Propose a workshop, guest speaker, or technical session to share
              with our community.
            </p>
          </div>

          <button
            onClick={() => navigate("/contact")}
            className="bg-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-pink-700 transition whitespace-nowrap ml-6"
          >
            Propose an Event →
          </button>
        </div>
      </section>

    </div>
  );
}