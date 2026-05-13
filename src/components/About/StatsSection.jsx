import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useInView } from '../../hooks/useInView';

const Counter = ({ target, suffix = "+" }) => {
  const [count, setCount] = useState(0);
  const [ref, visible] = useInView(0.5);

  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [visible, target]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const stats = [
  {
    icon: 'lucide:users',
    value: 500,
    label: 'ACTIVE MEMBERS',
  },
  {
    icon: 'lucide:star',
    value: 50,
    label: 'EVENTS HOSTED',
  },
  {
    icon: 'lucide:eye',
    value: 15,
    label: 'INDUSTRY PARTNERS',
    suffix: '',
  },
  {
    icon: 'lucide:rocket',
    value: 5,
    label: 'YEARS OF EXCELLENCE',
    suffix: '',
  },
];

const StatsSection = () => {
  const [sectionRef, isVisible] = useInView(0.2);

  return (
    <section ref={sectionRef} className="bg-[#B30069] py-12 md:py-16 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className={`flex flex-col items-center text-center text-white sm:border-r last:border-r-0 border-white/20 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: `${index * 150}ms` }}
          >
            <div className="w-10 h-10 mb-4 flex items-center justify-center bg-white/10 rounded-xl backdrop-blur-sm group-hover:scale-110 transition-transform">
              <Icon icon={stat.icon} className="text-2xl" />
            </div>
            <div className="text-2xl md:text-4xl font-bold mb-1 tracking-tight">
              <Counter target={stat.value} suffix={stat.suffix !== undefined ? stat.suffix : "+"} />
            </div>
            <div className="text-[10px] md:text-xs font-semibold tracking-widest uppercase opacity-80">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
