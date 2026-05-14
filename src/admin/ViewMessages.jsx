import { useEffect, useState } from 'react';
import { getMessages, deleteMessage, updateMessage } from '../services/contactService';
import { formatDateTime } from '../utils/formatDate';
import Loader from '../components/Loader';
import { useNotification } from '../context/NotificationContext';
import ConfirmDialog from '../components/ConfirmDialog';

export default function ViewMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread' | 'read'
  const [confirmMessageId, setConfirmMessageId] = useState(null);
  const { showToast } = useNotification();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await getMessages();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (messageId) => {
    try {
      setDeleting(messageId);
      await deleteMessage(messageId);
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
      setSelectedMessage(null);
    } catch (error) {
      console.error('Error deleting message:', error);
      showToast('Failed to delete message', 'error');
    } finally {
      setDeleting(null);
    }
  };

  const requestDelete = (messageId) => {
    setConfirmMessageId(messageId);
  };

  const closeDeleteDialog = () => {
    if (deleting) return;
    setConfirmMessageId(null);
  };

  const confirmDelete = async () => {
    if (!confirmMessageId) return;
    await handleDelete(confirmMessageId);
    setConfirmMessageId(null);
  };

  const handleSelectMessage = async (message) => {
    setSelectedMessage(message);
    // Mark as read if it's unread
    if (message.status === 'unread') {
      try {
        await updateMessage(message.id, { status: 'read' });
        setMessages((prev) =>
          prev.map((m) =>
            m.id === message.id ? { ...m, status: 'read' } : m
          )
        );
        setSelectedMessage({ ...message, status: 'read' });
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    }
  };

  if (loading) return <Loader />;

  const filtered =
    filter === 'all'
      ? messages
      : messages.filter((m) => (m.status ?? 'read') === filter);

  const unreadCount = messages.filter((m) => m.status === 'unread').length;

  const getInitials = (name = 'A') =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className="space-y-8">

      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-300">
            Inbox
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
            Messages
          </h1>
          <p className="mt-0.5 text-sm text-gray-400">
            {messages.length} total &nbsp;·&nbsp;
            <span className="font-semibold text-amber-500">{unreadCount} unread</span>
          </p>
        </div>

        {/* Refresh button */}
        <button
          onClick={fetchMessages}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-95"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* ── Stat chips ── */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: 'All',    value: 'all',    count: messages.length,                       color: 'purple' },
          { label: 'Unread', value: 'unread', count: unreadCount,                            color: 'amber'  },
          { label: 'Read',   value: 'read',   count: messages.length - unreadCount,          color: 'teal'   },
        ].map(({ label, value, count, color }) => {
          const active = filter === value;
          const styles = {
            purple: active
              ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-100'
              : 'bg-purple-50 text-purple-700 border-purple-100 hover:border-purple-300',
            amber: active
              ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-100'
              : 'bg-amber-50 text-amber-700 border-amber-100 hover:border-amber-300',
            teal: active
              ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-100'
              : 'bg-teal-50 text-teal-700 border-teal-100 hover:border-teal-300',
          };
          return (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-all duration-150 hover:-translate-y-0.5 ${styles[color]}`}
            >
              {label}
              <span className={`inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1 text-xs font-bold ${active ? 'bg-white/20' : 'bg-white'}`}>
                {count}
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-400">No messages found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* ── Message list ── */}
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm lg:col-span-1">
            <div className="border-b border-gray-50 px-5 py-4">
              <h2 className="text-sm font-semibold text-gray-800">Inbox</h2>
            </div>
            <div className="max-h-[520px] divide-y divide-gray-50 overflow-y-auto px-4 py-2">
              {filtered.map((message) => {
                const isSelected = selectedMessage?.id === message.id;
                const isUnread = message.status === 'unread';
                const initials = getInitials(message.name);
                return (
                  <button
                    key={message.id}
                    onClick={() => handleSelectMessage(message)}
                    className={`group w-full rounded-xl px-3 py-3.5 text-left transition-all duration-150 ${
                      isSelected
                        ? 'bg-purple-50'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        isSelected ? 'bg-purple-100 text-purple-600' : 'bg-pink-100 text-pink-600'
                      }`}>
                        {initials}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`truncate text-sm font-semibold ${isSelected ? 'text-purple-700' : 'text-gray-800'}`}>
                            {message.name}
                          </p>
                          {isUnread && (
                            <span className="h-2 w-2 flex-shrink-0 rounded-full bg-amber-400" />
                          )}
                        </div>
                        <p className="truncate text-xs text-gray-400">{message.email}</p>
                        <p className="mt-1 truncate text-xs text-gray-400">{message.message}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Message detail ── */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">

                {/* Detail header */}
                <div className="flex items-start justify-between border-b border-gray-50 px-6 py-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-pink-100 text-sm font-bold text-pink-600">
                      {getInitials(selectedMessage.name)}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">
                        {selectedMessage.name}
                      </h2>
                      <p className="text-sm text-gray-400">{selectedMessage.email}</p>
                      {selectedMessage.phone && (
                        <p className="text-sm text-gray-400">{selectedMessage.phone}</p>
                      )}
                    </div>
                  </div>

                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    selectedMessage.status === 'unread'
                      ? 'bg-amber-50 text-amber-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {selectedMessage.status ?? 'read'}
                  </span>
                </div>

                {/* Timestamp */}
                <div className="flex items-center gap-2 px-6 pt-4 text-xs text-gray-300">
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formatDateTime(selectedMessage.createdAt)}
                </div>

                {/* Body */}
                <div className="px-6 py-4">
                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between border-t border-gray-50 px-6 py-4">
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-4 py-2 text-sm font-semibold text-gray-500 transition-all hover:bg-gray-50 active:scale-95"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>

                  <button
                    onClick={() => requestDelete(selectedMessage.id)}
                    disabled={deleting === selectedMessage.id}
                    className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-red-100 transition-all hover:bg-red-600 hover:shadow-md hover:shadow-red-200 active:scale-95 disabled:opacity-50"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    {deleting === selectedMessage.id ? 'Deleting…' : 'Delete Message'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-300">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-300">Select a message to view details</p>
              </div>
            )}
          </div>

        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(confirmMessageId)}
        title="Delete Message"
        message="Are you sure you want to delete this message?"
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous
        onCancel={closeDeleteDialog}
        onConfirm={confirmDelete}
      />
    </div>
  );
}