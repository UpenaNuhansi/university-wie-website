import React, { useState, useEffect } from 'react';

const HeroSection = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="bg-purpleLight py-12 md:py-20 px-6 text-center overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-purple-100 shadow-sm mb-8 transition-all duration-1000 ${isReady ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></div>
          <span className="text-[10px] md:text-xs font-semibold tracking-widest text-primary/80 uppercase font-sans">
            Discover Our Journey
          </span>
        </div>
        
        <h1 className={`text-3xl md:text-6xl font-bold text-primary mb-8 leading-tight font-serif transition-all duration-1000 delay-200 ${isReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          Empowering <span className="text-accent font-accentFont">Women</span> to Lead in STEM
        </h1>
        
        <p className={`text-gray-800 text-base md:text-xl leading-relaxed max-w-3xl mx-auto font-medium transition-all duration-1000 delay-500 ${isReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          We are a vibrant community dedicated to fostering professional growth, 
          academic excellence, and inspiring the next generation of female innovators at 
          Sabaragamuwa University.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
