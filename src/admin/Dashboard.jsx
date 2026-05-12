import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '../services/eventService';
import { getMessages } from '../services/contactService';
import { getVolunteers } from '../services/volunteerService';
import { getGalleryItems } from '../services/galleryService';
import Loader from '../components/Loader';

const statCards = [
  {
    key: 'events',
    label: 'Total Events',
    accent: 'purple',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    key: 'messages',
    label: 'Messages',
    accent: 'pink',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
  },
  {
    key: 'volunteers',
    label: 'Volunteers',
    accent: 'teal',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    key: 'gallery',
    label: 'Gallery Items',
    accent: 'amber',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
];

const accentMap = {
  purple: {
    bg: 'bg-purple-50',
    icon: 'bg-purple-100 text-purple-600',
    text: 'text-purple-700',
    bar: 'bg-purple-500',
  },
  pink: {
    bg: 'bg-pink-50',
    icon: 'bg-pink-100 text-pink-600',
    text: 'text-pink-700',
    bar: 'bg-pink-500',
  },
  teal: {
    bg: 'bg-teal-50',
    icon: 'bg-teal-100 text-teal-600',
    text: 'text-teal-700',
    bar: 'bg-teal-500',
  },
  amber: {
    bg: 'bg-amber-50',
    icon: 'bg-amber-100 text-amber-600',
    text: 'text-amber-700',
    bar: 'bg-amber-500',
  },
};

const quickActions = [
  {
    to: '/admin/events/add',
    label: 'Add New Event',
    sub: 'Publish to website',
    primary: true,
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    to: '/admin/events',
    label: 'Manage Events',
    sub: 'Edit or delete',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    to: '/admin/gallery',
    label: 'Manage Gallery',
    sub: 'Upload photos',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    to: '/admin/messages',
    label: 'View Messages',
    sub: 'Inbox & replies',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
  },
];

export default function Dashboard() {
  const [stats, setStats] = useState({ events: 0, messages: 0, volunteers: 0, gallery: 0 });
  const [loading, setLoading] = useState(true);
  const [recentEvents, setRecentEvents] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [events, messages, volunteers, gallery] = await Promise.all([
          getEvents(),
          getMessages(),
          getVolunteers(),
          getGalleryItems(),
        ]);
        setStats({ events: events.length, messages: messages.length, volunteers: volunteers.length, gallery: gallery.length });
        setRecentEvents(events.slice(0, 4));
        setRecentMessages(messages.slice(0, 4));
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loader />;

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-300">{greeting}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          <p className="mt-0.5 text-sm text-gray-400">
            {now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Link
          to="/admin/events/add"
          className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple-100 transition-all hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-200 active:scale-95"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Event
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map(({ key, label, accent, icon }) => {
          const a = accentMap[accent];
          return (
            <div key={key} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${a.icon}`}>
                  {icon}
                </div>
                <div className={`h-1.5 w-8 rounded-full ${a.bar} opacity-30`} />
              </div>
              <p className={`mt-4 text-3xl font-bold tracking-tight ${a.text}`}>{stats[key]}</p>
              <p className="mt-1 text-xs font-medium text-gray-400">{label}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Recent Events */}
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-50 px-6 py-4">
            <h2 className="text-sm font-semibold text-gray-800">Recent Events</h2>
            <Link to="/admin/events" className="text-xs font-semibold text-purple-500 hover:text-purple-700">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-gray-50 px-6">
            {recentEvents.length > 0 ? (
              recentEvents.map((event) => (
                <div key={event.id} className="flex items-center gap-4 py-3.5">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-500">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-800">{event.title}</p>
                    <p className="text-xs text-gray-400">
                      {event.date ? new Date(event.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No date'}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                    Active
                  </span>
                </div>
              ))
            ) : (
              <div className="py-8 text-center">
                <p className="text-sm text-gray-300">No events yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-50 px-6 py-4">
            <h2 className="text-sm font-semibold text-gray-800">Recent Messages</h2>
            <Link to="/admin/messages" className="text-xs font-semibold text-purple-500 hover:text-purple-700">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-gray-50 px-6">
            {recentMessages.length > 0 ? (
              recentMessages.map((msg) => {
                const initials = (msg.name || 'A').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                return (
                  <div key={msg.id} className="flex items-start gap-4 py-3.5">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-pink-100 text-xs font-bold text-pink-600">
                      {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-800">{msg.name || 'Anonymous'}</p>
                      <p className="truncate text-xs text-gray-400">{msg.message}</p>
                      <p className="mt-0.5 text-[11px] text-gray-300">
                        {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : ''}
                      </p>
                    </div>
                    <span className={`mt-0.5 inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      msg.status === 'unread'
                        ? 'bg-amber-50 text-amber-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {msg.status ?? 'read'}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center">
                <p className="text-sm text-gray-300">No messages yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-300">Quick Actions</p>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {quickActions.map(({ to, label, sub, icon, primary }) => (
            <Link
              key={to}
              to={to}
              className={`group flex items-center gap-3 rounded-2xl border p-4 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md ${
                primary
                  ? 'border-purple-200 bg-purple-50 hover:border-purple-300 hover:shadow-purple-100'
                  : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-gray-100'
              }`}
            >
              <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl transition-colors ${
                primary
                  ? 'bg-purple-600 text-white group-hover:bg-purple-700'
                  : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
              }`}>
                {icon}
              </div>
              <div className="min-w-0">
                <p className={`text-sm font-semibold ${primary ? 'text-purple-700' : 'text-gray-700'}`}>{label}</p>
                <p className="text-[11px] text-gray-400">{sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}