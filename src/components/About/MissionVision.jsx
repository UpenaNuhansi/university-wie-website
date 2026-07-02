import React from 'react';
import { Icon } from '@iconify/react';
import { useInView } from '../../hooks/useInView';

const MissionVision = () => {
  const [ref, isVisible] = useInView(0.2);

  return (
    <section ref={ref} className="py-8 md:py-12 px-6 bg-purpleLight overflow-hidden">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Mission Card */}
        <div className={`bg-white p-6 md:p-10 rounded-3xl border border-purple-100 flex flex-col items-start hover:shadow-xl hover:shadow-purple-200/50 transition-all duration-700 group ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-6 border border-purple-100 shadow-sm group-hover:scale-110 transition-transform duration-300">
            <Icon icon="lucide:rocket" className="text-accent text-2xl" />
          </div>
          <h3 className="text-2xl font-bold text-primary mb-4 font-serif">Our Mission</h3>
          <p className="text-gray-800 text-base md:text-lg leading-relaxed font-sans">
            Facilitating the recruitment and retention of women in technical 
            disciplines globally.
          </p>
        </div>

        {/* Vision Card */}
        <div className={`bg-white p-6 md:p-10 rounded-3xl border border-purple-100 flex flex-col items-start hover:shadow-xl hover:shadow-purple-200/50 transition-all duration-700 delay-300 group ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-6 border border-purple-100 shadow-sm group-hover:scale-110 transition-transform duration-300">
            <Icon icon="lucide:eye" className="text-accent text-2xl" />
          </div>
          <h3 className="text-2xl font-bold text-primary mb-4 font-serif">Our Vision</h3>
          <p className="text-gray-800 text-base md:text-lg leading-relaxed font-sans">
            Leading to a vibrant community of IEEE women and men collectively 
            using their diverse talents to innovate for the benefit of humanity.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MissionVision;
