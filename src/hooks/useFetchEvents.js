import { useEffect, useState } from 'react';
import { getEvents } from '../services/eventService';

export default function useFetchEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEvents().then((data) => {
      setEvents(data);
      setLoading(false);
    });
  }, []);

  return { events, loading };
}
