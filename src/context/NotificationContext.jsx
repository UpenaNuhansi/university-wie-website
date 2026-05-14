import React, { createContext, useContext, useState, useCallback } from 'react';
import Toasts from '../components/Toasts';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', options = {}) => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    const toast = { id, message, type, ...options };
    setToasts((t) => [...t, toast]);
    const ttl = options.duration ?? 3500;
    if (ttl > 0) setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), ttl);
    return id;
  }, []);

  const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  return (
    <NotificationContext.Provider value={{ showToast, dismiss }}>
      {children}
      <Toasts toasts={toasts} onDismiss={dismiss} />
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider');
  return ctx;
}

export default NotificationContext;
