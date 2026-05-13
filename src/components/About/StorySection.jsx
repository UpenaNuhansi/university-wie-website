import React from 'react';
import { useInView } from '../../hooks/useInView';

const milestones = [
  {
    year: '2019',
    title: 'Inception & Establishment',
    description: 'The WIE Student Branch Affinity Group of SUSL was officially formed with a foundational cohort of 50 visionary students, laying the groundwork for a dedicated STEM community.'
  },
  {
    year: '2021',
    title: 'First International Collaboration',
    description: 'Partnered with Region 10 WIE to host a virtual global symposium, connecting local students with leading international researchers and industry experts during the global shift to digital platforms.'
  },
  {
    year: '2023',
    title: 'Award of Excellence',
    description: 'Recognized as the "Most Outstanding Affinity Group" in the local section for unparalleled dedication to member engagement and high-impact technical workshops.'
  }
];

const StorySection = () => {
  const [sectionRef, isVisible] = useInView(0.1);

  return (
    <section ref={sectionRef} className="py-12 md:py-20 px-6 bg-purpleLight overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className={`mb-12 md:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <p className="text-accent font-bold text-[10px] tracking-widest uppercase mb-3 font-sans">Our Story</p>
          <h2 className="text-2xl md:text-5xl font-bold text-primary mb-6 font-serif">Milestones That Shaped Us</h2>
          <p className="text-gray-800 text-base md:text-lg max-w-2xl leading-relaxed font-medium font-sans">
            A brief look at the milestones that have shaped our affinity group into the thriving community it is today.
          </p>
        </div>

        <div className="relative pl-4 md:pl-0">
          {/* Vertical Line */}
          <div className={`absolute left-4 md:left-[120px] top-0 bottom-0 w-px bg-purple-300 transition-all duration-[2s] origin-top ${isVisible ? 'scale-y-100' : 'scale-y-0'}`}></div>

          <div className="space-y-10 md:space-y-12 relative">
            {milestones.map((item, index) => (
              <div 
                key={index} 
                className={`flex flex-col md:flex-row items-start gap-6 md:gap-16 group transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}
                style={{ transitionDelay: `${index * 300 + 400}ms` }}
              >
                {/* Year and Dot */}
                <div className="flex flex-row md:flex-row items-center gap-4 min-w-[80px] md:min-w-[120px] relative">
                  <span className="text-xl md:text-2xl font-bold text-primary md:text-right w-full md:pr-10 group-hover:text-accent transition-colors duration-300 font-serif italic">{item.year}</span>
                  <div className="absolute left-[11px] md:left-auto md:right-[-5px] w-3 h-3 rounded-full bg-accent ring-4 ring-white z-10 group-hover:scale-125 transition-transform duration-300"></div>
                </div>

                {/* Card */}
                <div className="flex-1 bg-white p-6 md:p-8 rounded-3xl border border-purple-100 shadow-sm hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300 ml-8 md:ml-0">
                  <h4 className="text-lg md:text-xl font-bold text-primary mb-3 font-serif tracking-tight">{item.title}</h4>
                  <p className="text-gray-800 leading-relaxed text-sm md:text-base font-sans">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
