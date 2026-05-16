import { useEffect, useState } from 'react';
import { getEvents, subscribeToEvents } from '../services/eventService';

export default function useFetchEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsub;
    const start = async () => {
      try {
        // attempt to fetch initial snapshot (fallback)
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load events. Please try again later.';
        setError(message);
      } finally {
        setLoading(false);
      }

      // subscribe to realtime updates
      unsub = subscribeToEvents((items) => {
        setEvents(items);
      }, (err) => {
        const message = err instanceof Error ? err.message : 'Failed to subscribe to events.';
        setError(message);
      });
    };

    start();

    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, []);

  return { events, loading, error };
}
