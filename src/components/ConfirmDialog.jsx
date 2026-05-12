import { useState } from 'react';

export default function ConfirmDialog({
  isOpen,
  title = 'Confirm',
  message = 'Are you sure?',
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
}) {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      await onConfirm();
    } finally {
      setIsConfirming(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative rounded-2xl bg-white shadow-2xl p-6 max-w-sm w-full mx-4 animate-in fade-in duration-200">
        {/* Close icon */}
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Content */}
        <div className="text-center">
          {/* Icon */}
          <div
            className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
              isDangerous ? 'bg-red-100' : 'bg-purple-100'
            }`}
          >
            {isDangerous ? (
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
          </div>

          {/* Title */}
          <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>

          {/* Message */}
          <p className="mb-6 text-sm text-gray-600">{message}</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isConfirming}
            className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isConfirming}
            className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium text-white transition-colors disabled:opacity-50 ${
              isDangerous
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {isConfirming ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
