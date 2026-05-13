import React from 'react';
import { Link } from 'react-router-dom';
import { useInView } from '../../hooks/useInView';

const CTASection = () => {
  const [ref, isVisible] = useInView(0.2);

  return (
    <section ref={ref} className="py-20 px-6 bg-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className={`bg-gradient-to-r from-primary to-accent rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight max-w-3xl mx-auto font-serif tracking-tight">
            Ready to be a part of our <span className="text-pink-200 italic">empowered</span> community?
          </h2>
          
          <p className="text-white/80 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium font-sans">
            Join the IEEE WIE Student Branch Affinity Group of SUSL and start your journey 
            in STEM with the right support and network.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              to="/volunteer" 
              className="px-10 py-4 bg-white text-accent font-bold rounded-2xl hover:scale-105 transition transform duration-300 shadow-xl font-sans active:scale-95"
            >
              Become a Volunteer
            </Link>
            <Link 
              to="/contact" 
              className="px-10 py-4 bg-transparent border-2 border-white text-white font-bold rounded-2xl hover:bg-white/10 transition duration-300 active:scale-95"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
