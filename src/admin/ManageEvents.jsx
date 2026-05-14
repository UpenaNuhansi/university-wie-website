import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEvents, deleteEvent } from '../services/eventService';
import Loader from '../components/Loader';
import ConfirmDialog from '../components/ConfirmDialog';
import { useNotification } from '../context/NotificationContext';

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [confirmEventId, setConfirmEventId] = useState(null);
  const { showToast } = useNotification();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await getEvents();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId) => {
    try {
      setDeleting(eventId);
      await deleteEvent(eventId);
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
    } catch (error) {
      console.error('Error deleting event:', error);
      showToast('Failed to delete event', 'error');
    } finally {
      setDeleting(null);
    }
  };

  const requestDelete = (eventId) => {
    setConfirmEventId(eventId);
  };

  const closeDeleteDialog = () => {
    if (deleting) return;
    setConfirmEventId(null);
  };

  const confirmDelete = async () => {
    if (!confirmEventId) return;
    await handleDelete(confirmEventId);
    setConfirmEventId(null);
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-300">Admin</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">Manage Events</h1>
          <p className="mt-0.5 text-sm text-gray-400">
            {events.length} event{events.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <Link
          to="/admin/events/add"
          className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple-100 transition-all hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-200 active:scale-95"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Event
        </Link>
      </div>

      {/* Empty State */}
      {events.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-400">
            <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="mt-4 text-sm font-semibold text-gray-700">No events yet</p>
          <p className="mt-1 text-xs text-gray-400">Create your first event to get started</p>
          <Link
            to="/admin/events/add"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple-100 transition-all hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-200 active:scale-95"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Create Event
          </Link>
        </div>
      ) : (
        <>
          {/* Stats Summary Row */}
          <div className="grid grid-cols-3 gap-4">
            {/* Total */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="h-1.5 w-8 rounded-full bg-purple-500 opacity-30" />
              </div>
              <p className="mt-4 text-3xl font-bold tracking-tight text-purple-700">{events.length}</p>
              <p className="mt-1 text-xs font-medium text-gray-400">Total Events</p>
            </div>

            {/* Upcoming */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-600">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="h-1.5 w-8 rounded-full bg-teal-500 opacity-30" />
              </div>
              <p className="mt-4 text-3xl font-bold tracking-tight text-teal-700">
                {events.filter((e) => e.date && new Date(e.date) >= new Date()).length}
              </p>
              <p className="mt-1 text-xs font-medium text-gray-400">Upcoming</p>
            </div>

            {/* Past */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="h-1.5 w-8 rounded-full bg-amber-500 opacity-30" />
              </div>
              <p className="mt-4 text-3xl font-bold tracking-tight text-amber-700">
                {events.filter((e) => e.date && new Date(e.date) < new Date()).length}
              </p>
              <p className="mt-1 text-xs font-medium text-gray-400">Past Events</p>
            </div>
          </div>

          {/* Events List */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-300">All Events</p>
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
              {/* List Header */}
              <div className="grid grid-cols-12 border-b border-gray-50 px-6 py-3">
                <p className="col-span-4 text-xs font-semibold text-gray-400">Title</p>
                <p className="col-span-2 text-xs font-semibold text-gray-400">Date</p>
                <p className="col-span-2 text-xs font-semibold text-gray-400">Location</p>
                <p className="col-span-2 text-xs font-semibold text-gray-400">Description</p>
                <p className="col-span-2 text-right text-xs font-semibold text-gray-400">Action</p>
              </div>

              {/* List Rows */}
              <div className="divide-y divide-gray-50 px-6">
                {events.map((event) => {
                  const isPast = event.date && new Date(event.date) < new Date();
                  return (
                    <div
                      key={event.id}
                      className="group grid grid-cols-12 items-center gap-2 py-4 transition-all duration-150"
                    >
                      {/* Title */}
                      <div className="col-span-4 flex items-center gap-3">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-500 transition-colors group-hover:bg-purple-100">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-gray-800">{event.title}</p>
                          {((event.registrationEnabled ?? event.allowRegister) || event.registrationLink || event.registerLink) && (
                            <p className="mt-1 text-[11px] font-semibold text-purple-600">
                              Registration: {event.registrationType === 'google' || (event.registrationLink || event.registerLink || '').includes('docs.google.com') ? 'Google Form' : 'Custom Form'}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Date */}
                      <div className="col-span-2">
                        {event.date ? (
                          (() => {
                            const eventDate = event.date instanceof Date ? event.date : new Date(event.date);
                            const isValidDate = !isNaN(eventDate);
                            const dateIsPast = isValidDate && eventDate < new Date();
                            return (
                              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                dateIsPast
                                  ? 'bg-gray-100 text-gray-400'
                                  : 'bg-green-50 text-green-600'
                              }`}>
                                {!dateIsPast && isValidDate && <span className="h-1.5 w-1.5 rounded-full bg-green-400" />}
                                {isValidDate ? eventDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Invalid Date'}
                              </span>
                            );
                          })()
                        ) : (
                          <span className="text-xs text-gray-300">No date</span>
                        )}
                      </div>

                      {/* Location */}
                      <div className="col-span-2 flex items-center gap-1.5">
                        {event.location ? (
                          <>
                            <svg className="h-3.5 w-3.5 flex-shrink-0 text-gray-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="truncate text-xs text-gray-500">{event.location}</span>
                          </>
                        ) : (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                      </div>

                      {/* Description */}
                      <div className="col-span-2">
                        <p className="truncate text-xs text-gray-400">
                          {event.description || <span className="text-gray-300">No description</span>}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="col-span-1 flex justify-end gap-1">
                        <Link
                          to={`/admin/events/${event.id}/edit`}
                          className="inline-flex items-center gap-1 rounded-lg border border-blue-100 bg-blue-50 px-2.5 py-1.5 text-[11px] font-semibold text-blue-500 transition-all hover:border-blue-200 hover:bg-blue-100 hover:text-blue-700"
                        >
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </Link>
                        <button
                          onClick={() => requestDelete(event.id)}
                          disabled={deleting === event.id}
                          className="inline-flex items-center gap-1 rounded-lg border border-red-100 bg-red-50 px-2.5 py-1.5 text-[11px] font-semibold text-red-500 transition-all hover:border-red-200 hover:bg-red-100 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {deleting === event.id ? (
                            <>
                              <svg className="h-3 w-3 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                              </svg>
                              Deleting
                            </>
                          ) : (
                            <>
                              <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      <ConfirmDialog
        isOpen={Boolean(confirmEventId)}
        title="Delete Event"
        message="Are you sure you want to delete this event?"
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous
        onCancel={closeDeleteDialog}
        onConfirm={confirmDelete}
      />
    </div>
  );
}