import { useEffect, useState } from 'react';
import { getVolunteers, deleteVolunteer, updateVolunteer } from '../services/volunteerService';
import { sendVolunteerStatusEmail } from '../services/emailService';
import { formatDateTime } from '../utils/formatDate';
import Loader from '../components/Loader';

export default function ViewVolunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [processing, setProcessing] = useState(null); // Track approve/reject actions
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'approved' | 'rejected'

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    try {
      setLoading(true);
      const data = await getVolunteers();
      setVolunteers(data);
    } catch (error) {
      console.error('Error fetching volunteers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (volunteerId) => {
    const volunteer = volunteers.find((v) => v.id === volunteerId);
    if (!volunteer) return;

    try {
      setProcessing(volunteerId);
      
      // Update status in database
      await updateVolunteer(volunteerId, { status: 'approved' });
      
      // Send email notification
      await sendVolunteerStatusEmail(volunteer, 'approved');
      
      // Update local state
      setVolunteers((prev) =>
        prev.map((v) =>
          v.id === volunteerId ? { ...v, status: 'approved' } : v
        )
      );
      
      // Update selected volunteer display
      if (selectedVolunteer?.id === volunteerId) {
        setSelectedVolunteer({ ...selectedVolunteer, status: 'approved' });
      }
      
      alert('✅ Volunteer approved and email sent!');
    } catch (error) {
      console.error('Error approving volunteer:', error);
      alert('Failed to approve volunteer');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (volunteerId) => {
    const volunteer = volunteers.find((v) => v.id === volunteerId);
    if (!volunteer) return;

    try {
      setProcessing(volunteerId);
      
      // Update status in database
      await updateVolunteer(volunteerId, { status: 'rejected' });
      
      // Send email notification
      await sendVolunteerStatusEmail(volunteer, 'rejected');
      
      // Update local state
      setVolunteers((prev) =>
        prev.map((v) =>
          v.id === volunteerId ? { ...v, status: 'rejected' } : v
        )
      );
      
      // Update selected volunteer display
      if (selectedVolunteer?.id === volunteerId) {
        setSelectedVolunteer({ ...selectedVolunteer, status: 'rejected' });
      }
      
      alert('❌ Volunteer rejected and email sent!');
    } catch (error) {
      console.error('Error rejecting volunteer:', error);
      alert('Failed to reject volunteer');
    } finally {
      setProcessing(null);
    }
  };

  const handleDelete = async (volunteerId) => {
    if (!confirm('Are you sure you want to delete this volunteer application?')) return;
    try {
      setDeleting(volunteerId);
      await deleteVolunteer(volunteerId);
      setVolunteers((prev) => prev.filter((v) => v.id !== volunteerId));
      setSelectedVolunteer(null);
    } catch (error) {
      console.error('Error deleting volunteer:', error);
      alert('Failed to delete volunteer');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) return <Loader />;

  const counts = {
    all: volunteers.length,
    pending: volunteers.filter((v) => v.status === 'pending').length,
    approved: volunteers.filter((v) => v.status === 'approved').length,
    rejected: volunteers.filter((v) => v.status === 'rejected').length,
  };

  const filtered =
    filter === 'all' ? volunteers : volunteers.filter((v) => v.status === filter);

  const getInitials = (name = 'A') =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  const statusStyles = {
    pending:  { badge: 'bg-amber-50 text-amber-600',  dot: 'bg-amber-400'  },
    approved: { badge: 'bg-green-50 text-green-600',  dot: 'bg-green-400'  },
    rejected: { badge: 'bg-red-50 text-red-500',      dot: 'bg-red-400'    },
  };

  const filterChips = [
    { label: 'All',      value: 'all',      color: 'purple' },
    { label: 'Pending',  value: 'pending',  color: 'amber'  },
    { label: 'Approved', value: 'approved', color: 'teal'   },
    { label: 'Rejected', value: 'rejected', color: 'rose'   },
  ];

  const chipActive = {
    purple: 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-100',
    amber:  'bg-amber-500  text-white border-amber-500  shadow-md shadow-amber-100',
    teal:   'bg-teal-600   text-white border-teal-600   shadow-md shadow-teal-100',
    rose:   'bg-rose-500   text-white border-rose-500   shadow-md shadow-rose-100',
  };
  const chipIdle = {
    purple: 'bg-purple-50 text-purple-700 border-purple-100 hover:border-purple-300',
    amber:  'bg-amber-50  text-amber-700  border-amber-100  hover:border-amber-300',
    teal:   'bg-teal-50   text-teal-700   border-teal-100   hover:border-teal-300',
    rose:   'bg-rose-50   text-rose-700   border-rose-100   hover:border-rose-300',
  };

  return (
    <div className="space-y-8">

      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-300">
            Applications
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
            Volunteers
          </h1>
          <p className="mt-0.5 text-sm text-gray-400">
            {volunteers.length} total &nbsp;·&nbsp;
            <span className="font-semibold text-amber-500">{counts.pending} pending</span>
          </p>
        </div>

        <button
          onClick={fetchVolunteers}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-95"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* ── Filter chips ── */}
      <div className="flex flex-wrap gap-3">
        {filterChips.map(({ label, value, color }) => {
          const active = filter === value;
          return (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-all duration-150 hover:-translate-y-0.5 ${
                active ? chipActive[color] : chipIdle[color]
              }`}
            >
              {label}
              <span className={`inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1 text-xs font-bold ${active ? 'bg-white/20' : 'bg-white'}`}>
                {counts[value]}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Empty state ── */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-16 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-400">No volunteer applications found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* ── Volunteer list ── */}
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm lg:col-span-1">
            <div className="border-b border-gray-50 px-5 py-4">
              <h2 className="text-sm font-semibold text-gray-800">Applicants</h2>
            </div>
            <div className="max-h-[520px] divide-y divide-gray-50 overflow-y-auto px-4 py-2">
              {filtered.map((volunteer) => {
                const isSelected = selectedVolunteer?.id === volunteer.id;
                const status = volunteer.status ?? 'pending';
                const s = statusStyles[status] ?? statusStyles.pending;
                return (
                  <button
                    key={volunteer.id}
                    onClick={() => setSelectedVolunteer(volunteer)}
                    className={`w-full rounded-xl px-3 py-3.5 text-left transition-all duration-150 ${
                      isSelected ? 'bg-teal-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        isSelected ? 'bg-teal-100 text-teal-600' : 'bg-teal-100 text-teal-600'
                      }`}>
                        {getInitials(volunteer.name)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`truncate text-sm font-semibold ${isSelected ? 'text-teal-700' : 'text-gray-800'}`}>
                            {volunteer.name}
                          </p>
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${s.badge}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                            {status}
                          </span>
                        </div>
                        <p className="truncate text-xs text-gray-400">{volunteer.email}</p>
                        <p className="mt-0.5 truncate text-xs text-gray-300">
                          {volunteer.major || 'Major not specified'}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Volunteer detail ── */}
          <div className="lg:col-span-2">
            {selectedVolunteer ? (
              <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">

                {/* Detail header */}
                <div className="flex items-start justify-between border-b border-gray-50 px-6 py-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-600">
                      {getInitials(selectedVolunteer.name)}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">
                        {selectedVolunteer.name}
                      </h2>
                      <p className="text-sm text-gray-400">{selectedVolunteer.email}</p>
                      {selectedVolunteer.phone && (
                        <p className="text-sm text-gray-400">{selectedVolunteer.phone}</p>
                      )}
                    </div>
                  </div>

                  {(() => {
                    const s = statusStyles[selectedVolunteer.status] ?? statusStyles.pending;
                    return (
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${s.badge}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                        {selectedVolunteer.status ?? 'pending'}
                      </span>
                    );
                  })()}
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-2 gap-4 px-6 py-5">
                  <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-300">
                      Major / Program
                    </p>
                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      {selectedVolunteer.major || 'Not specified'}
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-300">
                      Year
                    </p>
                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      {selectedVolunteer.year || 'Not specified'}
                    </p>
                  </div>

                  <div className="col-span-2 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-300">
                      Applied On
                    </p>
                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      {formatDateTime(selectedVolunteer.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Experience & Message */}
                {(selectedVolunteer.experience || selectedVolunteer.message) && (
                  <div className="space-y-3 px-6 pb-5">
                    {selectedVolunteer.experience && (
                      <div>
                        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-300">
                          Experience
                        </p>
                        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                          <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                            {selectedVolunteer.experience}
                          </p>
                        </div>
                      </div>
                    )}
                    {selectedVolunteer.message && (
                      <div>
                        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-300">
                          Message
                        </p>
                        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                          <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                            {selectedVolunteer.message}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-3 border-t border-gray-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    onClick={() => setSelectedVolunteer(null)}
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-4 py-2 text-sm font-semibold text-gray-500 transition-all hover:bg-gray-50 active:scale-95"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>

                  {/* Status-based action buttons */}
                  <div className="flex flex-wrap gap-2">
                    {selectedVolunteer.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleApprove(selectedVolunteer.id)}
                          disabled={processing === selectedVolunteer.id}
                          className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-green-100 transition-all hover:bg-green-700 hover:shadow-md hover:shadow-green-200 active:scale-95 disabled:opacity-50"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          {processing === selectedVolunteer.id ? 'Processing…' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleReject(selectedVolunteer.id)}
                          disabled={processing === selectedVolunteer.id}
                          className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-red-100 transition-all hover:bg-red-700 hover:shadow-md hover:shadow-red-200 active:scale-95 disabled:opacity-50"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          {processing === selectedVolunteer.id ? 'Processing…' : 'Reject'}
                        </button>
                      </>
                    ) : (
                      <span className="inline-flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-500">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Status: {selectedVolunteer.status}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(selectedVolunteer.id)}
                    disabled={deleting === selectedVolunteer.id}
                    className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-red-100 transition-all hover:bg-red-600 hover:shadow-md hover:shadow-red-200 active:scale-95 disabled:opacity-50"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    {deleting === selectedVolunteer.id ? 'Deleting…' : 'Delete'}
                  </button>
                </div>

              </div>
            ) : (
              <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-300">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-300">Select a volunteer to view details</p>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}