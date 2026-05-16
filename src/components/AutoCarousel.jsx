import React, { useEffect, useState } from 'react';

export default function AutoCarousel({ year, posters = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const posterSignature = posters.map((poster) => poster.id || poster.image).join('|');

  useEffect(() => {
    if (posters.length === 0) return undefined;

    setActiveIndex(0);
    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % posters.length);
    }, 3500);

    return () => window.clearInterval(intervalId);
  }, [posterSignature, posters.length]);

  if (posters.length === 0) return null;

  const activePoster = posters[activeIndex];

  return (
    <div className="max-w-5xl mx-auto px-4 mt-8">
      <div className="group relative bg-white p-4 md:p-6 rounded-[2.5rem] shadow-[0_20px_50px_rgba(76,29,149,0.1)] border border-purple-50 overflow-hidden transition-all duration-500 hover:shadow-[0_30px_60px_rgba(76,29,149,0.15)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-primary/40 font-bold">Official Posters</p>
            <h3 className="mt-1 text-xl md:text-2xl font-bold text-primary font-serif">{year}</h3>
          </div>
          {posters.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {posters.map((poster, index) => (
                <button
                  key={`${poster.id || poster.image || index}`}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${index === activeIndex ? 'w-8 bg-accent' : 'w-2.5 bg-purple-200 hover:bg-purple-300'}`}
                  aria-label={`Show poster ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="relative overflow-hidden rounded-[1.5rem] bg-purple-50/50 aspect-[16/10] md:aspect-[16/8] flex items-center justify-center">
          <img
            key={activePoster.image}
            src={activePoster.image}
            alt={`${year} poster ${activeIndex + 1}`}
            className="w-full h-full object-contain block mx-auto p-3 md:p-6 transition-opacity duration-500"
            loading="lazy"
          />
        </div>

        <div className="mt-4 flex flex-col gap-1 md:flex-row md:items-center md:justify-between px-1">
          <div>
            <p className="text-sm font-semibold text-primary">{activePoster.name || 'Committee Poster'}</p>
            <p className="text-xs text-primary/60">{activePoster.position || `Poster for ${year}`}</p>
          </div>
          {posters.length > 1 && (
            <p className="text-xs uppercase tracking-[0.2em] text-primary/40 font-bold">
              {activeIndex + 1} of {posters.length}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}