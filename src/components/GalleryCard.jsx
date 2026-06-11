export default function GalleryCard({ item }) {
  const { title, image, category, createdAt, description } = item;

  const formattedDate = createdAt
    ? new Date(
        createdAt.seconds ? createdAt.seconds * 1000 : createdAt
      ).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

  return (
    <article className="group overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-200/40">

      <div className="aspect-[4/3] overflow-hidden bg-purpleLight">
        {image ? (
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-primary/20">
            <svg className="h-12 w-12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      <div className="p-5 font-sans">
        {category && (
          <span className="inline-flex items-center rounded-full bg-purpleLight border border-purple-100 px-2.5 py-0.5 text-[11px] font-semibold text-accent">
            {category}
          </span>
        )}

        <h3 className="mt-2 font-serif text-base font-bold leading-snug text-primary group-hover:text-accent transition-colors">
          {title}
        </h3>

        {description && (
          <p className="mt-2 text-sm leading-relaxed text-gray-800 line-clamp-2">
            {description}
          </p>
        )}

        {formattedDate && (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-gray-500">
            <svg className="h-3.5 w-3.5 text-accent" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formattedDate}
          </p>
        )}
      </div>
    </article>
  );
}
