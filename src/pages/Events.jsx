import EventCard from '../components/EventCard';

const sampleEvents = [
  { title: 'Leadership Workshop', date: '2026-05-20', description: 'Career and leadership growth.' }
];

export default function Events() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Events</h1>
      {sampleEvents.map((event) => (
        <EventCard key={event.title} {...event} />
      ))}
    </section>
  );
}
