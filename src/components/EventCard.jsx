export default function EventCard({ title, date, description }) {
  return (
    <article className="rounded border bg-white p-4 shadow-sm">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-gray-500">{date}</p>
      <p className="mt-2 text-sm">{description}</p>
    </article>
  );
}
