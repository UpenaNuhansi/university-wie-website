import React from 'react';

function Toast({ toast, onDismiss }) {
  const colors = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-purple-600',
    warn: 'bg-amber-600',
  };
  return (
    <div className="group relative mb-3 w-80 rounded-lg shadow-lg">
      <div className={`flex items-center gap-3 rounded-lg p-3 text-white ${colors[toast.type] || colors.info}`}>
        <div className="flex-1 text-sm">{toast.message}</div>
        <button
          onClick={() => onDismiss(toast.id)}
          className="opacity-80 transition-opacity hover:opacity-100"
          aria-label="Dismiss"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function Toasts({ toasts = [], onDismiss = () => {} }) {
  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col-reverse items-end">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
