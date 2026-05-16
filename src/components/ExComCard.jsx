import React, { useState } from 'react';

const ExComCard = ({ name, position, image, isTop, isCurrent }) => {
  const [imgError, setImgError] = useState(false);
  const [loading, setLoading] = useState(true);

  return (
    <div 
      className="group relative bg-white rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(76,29,149,0.08)] transition-all duration-500 flex flex-col items-center text-center border border-purple-50/50 hover:border-purple-100/50 hover:-translate-y-2"
      role="article"
      tabIndex="0"
    >
      {/* Image Container */}
      <div className="relative w-36 h-36 md:w-44 md:h-44 mb-6 perspective-1000">
        <div className="w-full h-full rounded-full p-1.5 border-2 border-dashed border-purple-200 group-hover:border-purple-400 transition-all duration-700 ease-out">
          <div className="w-full h-full rounded-full overflow-hidden relative bg-purple-50 ring-4 ring-white shadow-inner">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-purple-50/50 backdrop-blur-sm z-10">
                <div className="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              </div>
            )}
            <img 
              src={imgError || !image ? 'https://via.placeholder.com/400?text=WIE+Member' : image} 
              alt={`Portrait of ${name}, ${position}`} 
              className={`w-full h-full object-cover group-hover:scale-110 transition-all duration-700 ease-in-out ${loading ? 'scale-110 blur-sm' : 'scale-100 blur-0'}`}
              onLoad={() => setLoading(false)}
              onError={() => {
                setImgError(true);
                setLoading(false);
              }}
              loading="lazy"
            />
          </div>
        </div>
        
        {/* Subtle decorative element */}
        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-accent rounded-full border-4 border-white shadow-sm scale-0 group-hover:scale-100 transition-transform duration-500 delay-100 flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
        </div>
      </div>
      
      {/* Text Content */}
      <div className="space-y-2 w-full px-2">
        <h3 className="font-serif text-xl md:text-2xl font-bold text-primary group-hover:text-accent transition-colors duration-300 leading-tight">
          {name}
        </h3>
        <div className="flex items-center justify-center gap-2">
          <div className="inline-block px-4 py-1.5 rounded-full bg-purple-50 group-hover:bg-primary group-hover:text-white transition-all duration-300">
            <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest">
              {position}
            </p>
          </div>
          {/* <div className="flex items-center gap-2">
            {isTop && (
              <span className="text-[10px] bg-purple-50 text-purple-500 px-2 py-0.5 rounded-full inline-block uppercase font-bold">Top Position</span>
            )}
            {isCurrent && (
              <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full inline-block uppercase font-bold">Current</span>
            )}
          </div> */}
        </div>
      </div>

      {/* Decorative background glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-purple-50/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
    </div>
  );
};

export default ExComCard;
