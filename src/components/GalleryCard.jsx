export default function GalleryCard({ title }) {
  return (
    <article className="rounded border bg-white p-4 shadow-sm">
      <h3 className="font-medium">{title}</h3>
    </article>
  );
}
