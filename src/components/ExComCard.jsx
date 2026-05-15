import React, { useState } from 'react';

const ExComCard = ({ name, position, image }) => {
  const [imgError, setImgError] = useState(false);
  const [loading, setLoading] = useState(true);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center group">
      <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden mb-6 border-4 border-purple-50 group-hover:border-purple-100 transition-colors duration-300 relative bg-gray-100">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
        )}
        <img 
          src={imgError || !image ? 'https://via.placeholder.com/150?text=No+Image' : image} 
          alt={name} 
          className={`w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110 ${loading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setLoading(false)}
          onError={() => {
            setImgError(true);
            setLoading(false);
          }}
        />
      </div>
      
      <div className="bg-[#4c1d95] text-white w-full py-3 px-4 rounded-xl">
        <h3 className="font-semibold text-sm md:text-base leading-tight">{position}</h3>
        <p className="text-xs md:text-sm text-purple-200 mt-1">{name}</p>
      </div>
    </div>
  );
};

export default ExComCard;
