import React from 'react';
import { useInView } from '../../hooks/useInView';
import aboutImage from '../../assets/about/ab-bg.jpg';

const AboutSection = () => {
  const [sectionRef, isVisible] = useInView(0.2);

  return (
    <section ref={sectionRef} className="py-12 md:py-20 px-6 bg-purpleLight overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className={`lg:w-3/5 bg-white p-6 md:p-12 rounded-3xl border border-purple-100 shadow-sm transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
          <div className="w-10 h-0.5 bg-gradient-to-r from-accent to-purple-500 mb-4 rounded-full"></div>
          <h2 className="text-2xl md:text-4xl font-bold text-primary mb-6 font-serif tracking-tight">Who We Are</h2>
          <div className="space-y-6 text-gray-800 text-base md:text-lg leading-relaxed">
            <p>
              The IEEE Women in Engineering (WIE) Student Branch Affinity Group of Sabaragamuwa University 
              of Sri Lanka (SUSL) is a premier network of passionate students and academics. We are united by 
              a common goal: to break down barriers and create a supportive ecosystem for women pursuing 
              technical fields.
            </p>
            <p>
              Founded on principles of inclusion and excellence, we organize workshops, technical talks, 
              mentoring sessions, and global networking opportunities to equip our members with the skills 
              necessary to thrive in an evolving technological landscape.
            </p>
          </div>
        </div>
        
        <div className={`lg:w-2/5 w-full transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-tr from-accent to-primary rounded-3xl opacity-10 blur-xl group-hover:opacity-25 transition duration-500"></div>
            <img 
              src="/images/about-who-we-are.png" 
              alt="WIE Team working" 
              className="relative rounded-3xl shadow-2xl w-full object-cover aspect-[4/3] transform group-hover:scale-[1.02] transition-transform duration-500"
              onError={(e) => {
                e.target.src = aboutImage;
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
