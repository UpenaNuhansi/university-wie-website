import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ExComCard from '../components/ExComCard';
import { getPastCommittees } from '../utils/dynamicExCom';
import { excomData } from '../utils/excomData';
import { useAuth } from '../hooks/useAuth';
import { Icon } from '@iconify/react';
import AutoCarousel from '../components/AutoCarousel';

// Local images for 2025/2026 Executive Committee
import hashiniImg from '../assets/Ex com 26/Hashini Herath_Vice Secretary.JPG';
import imashaImg from '../assets/Ex com 26/Imasha Kumarasinghe-Secretary.jpg';
import jithmiImg from '../assets/Ex com 26/Jithmi Wickramasinghe_ Public Relations Manager.jpg';
import piumiImg from '../assets/Ex com 26/Piumi Yasodhara_Treasurer .jpeg';
import raaziyaImg from '../assets/Ex com 26/Raaziya Hussain _ Chair .jpg';
import sewminiImg from '../assets/Ex com 26/Sewmini Kumaranayaka _Vice Chair .jpg';
import vishakaImg from '../assets/Ex com 26/Vishaka Lakmali - Event Coordinator.png';
import kaviniImg from '../assets/Ex com 26/kavini Gavesha -Volunteer Coordinator.jpeg';

const rawMembersData = [
  { filename: 'Hashini Herath_Vice Secretary.JPG', image: hashiniImg },
  { filename: 'Imasha Kumarasinghe-Secretary.jpg', image: imashaImg },
  { filename: 'Jithmi Wickramasinghe_ Public Relations Manager.jpg', image: jithmiImg },
  { filename: 'Piumi Yasodhara_Treasurer .jpeg', image: piumiImg },
  { filename: 'Raaziya Hussain _ Chair .jpg', image: raaziyaImg },
  { filename: 'Sewmini Kumaranayaka _Vice Chair .jpg', image: sewminiImg },
  { filename: 'Vishaka Lakmali - Event Coordinator.png', image: vishakaImg },
  { filename: 'kavini Gavesha -Volunteer Coordinator.jpeg', image: kaviniImg }
];

const POSITION_HIERARCHY = {
  'Chair': 1,
  'Chairperson': 1,
  'Vice Chair': 2,
  'Vice Chairperson': 2,
  'Secretary': 3,
  'Vice Secretary': 4,
  'Treasurer': 5,
  'Public Relations Manager': 6,
  'Event Coordinator': 7,
  'Volunteer Coordinator': 8
};

const parseFilename = (filename) => {
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
  let parts = [];
  
  if (nameWithoutExt.includes('_')) {
    parts = nameWithoutExt.split('_');
  } else if (nameWithoutExt.includes('-')) {
    parts = nameWithoutExt.split('-');
  } else {
    parts = [nameWithoutExt, ''];
  }
  
  const name = parts[0].trim();
  const position = parts[1] ? parts[1].trim() : '';
  
  const formattedName = name
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const formattedPosition = position
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
    
  return { name: formattedName, position: formattedPosition };
};

const localMembers = rawMembersData.map(({ filename, image }) => {
  const { name, position } = parseFilename(filename);
  const isTop = position.toLowerCase() === 'chair' || position.toLowerCase() === 'chairperson';
  return {
    name,
    position,
    image,
    isTop,
    isCurrent: true,
    year: '2025/2026',
    status: 'Current Excom',
    type: 'card',
    hierarchy: POSITION_HIERARCHY[position] || 99
  };
}).sort((a, b) => a.hierarchy - b.hierarchy);

const ExecutiveCommittee = () => {
  const navigate = useNavigate();
  const [isReady, setIsReady] = useState(false);
  const { user } = useAuth() || {}; 
  const isAdmin = !!user;

  const currentYear = '2025/2026';
  
  // Get other years' members from static data source
  const otherYearsMembers = excomData
    .filter(section => section.year !== currentYear)
    .flatMap(section => 
      section.members.map(member => ({
        ...member,
        year: section.year,
        status: section.status || '',
        type: section.type || 'card'
      }))
    );

  // Get past committee posters
  const pastPosters = getPastCommittees();

  // Combine local members, past years, and posters
  const members = [...localMembers, ...otherYearsMembers, ...pastPosters];

  // CSS for grain effect
  const grainStyle = {
    position: 'relative'
  };

  const grainAfterStyle = {
    content: '""',
    position: 'absolute',
    inset: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
    pointerEvents: 'none',
    mixBlendMode: 'multiply',
    zIndex: 0
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => setIsReady(true), 100);
  }, []);

  const yearGroups = [...new Set(members.map(m => m.year))].sort((a, b) => {
    return b.localeCompare(a);
  }).map(year => {
    const items = members.filter(m => m.year === year);
    const statusFromField = items.find(i => i.status)?.status || '';
    const hasCurrent = items.some(i => i.isCurrent);
    return {
      year,
      status: statusFromField || (hasCurrent ? 'Current Excom' : ''),
      items
    };
  });

  return (
    <div className="bg-purple-100 min-h-screen font-sans overflow-hidden relative">
      {/* Grain Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
          mixBlendMode: 'multiply'
        }}
      ></div>
      {/* Header Section */}
      <section className="relative pt-24 pb-16 px-6 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purpleLight rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purpleLight rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-purple-100 mb-8 transition-all duration-1000 ${isReady ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
            <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-primary uppercase">
              Leadership Legacy
            </span>
          </div>

          <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold text-primary mb-8 font-serif transition-all duration-1000 delay-200 ${isReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Executive <span className="text-accent italic">Committee</span>
          </h1>

          <p className={`text-gray-500 text-base md:text-lg leading-relaxed max-w-2xl mx-auto transition-all duration-1000 delay-500 ${isReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Celebrating the leaders who have shaped our chapter's journey. From our current innovators to the founders who paved the way.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-32 space-y-24">
        {yearGroups.map((section, idx) => (
          <div 
            key={section.year} 
            className={`transition-all duration-1000 ${isReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
            style={{ transitionDelay: `${idx * 150 + 700}ms` }}
          >
            {/* Section Header */}
            <div className="flex flex-col items-center mb-16 relative">
              <div className="absolute inset-0 flex items-center justify-center -z-10">
                <div className="h-px w-full max-w-lg bg-gradient-to-r from-transparent via-purple-100 to-transparent"></div>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-primary font-serif bg-transparent px-8 py-2 relative">
                {section.year}
                {isAdmin && (
                  <button 
                    className="absolute -right-4 top-0 p-2 bg-white rounded-full shadow-md text-primary hover:bg-primary hover:text-white transition-all duration-300 scale-75"
                    onClick={() => navigate('/admin/excom')}
                  >
                    <Icon icon="mdi:pencil" width={18} />
                  </button>
                )}
              </h2>
              {section.status && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent"></span>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{section.status}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-accent"></span>
                </div>
              )}
            </div>

            {/* Render Cards */}
            {section.items.some(i => i.type === 'card') && (
              <div className="flex flex-col items-center mb-12">
                <div className="mb-12 w-full flex justify-center">
                  {section.items.filter(m => m.isTop && m.type === 'card').map((member, mIdx) => (
                    <div key={mIdx} className="w-full max-w-sm">
                      <ExComCard {...member} />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10 w-full max-w-7xl px-4">
                  {section.items.filter(m => !m.isTop && m.type === 'card').map((member, mIdx) => (
                    <ExComCard key={mIdx} {...member} />
                  ))}
                </div>
              </div>
            )}

            {/* Render Posters */}
            {section.items.some(i => i.type === 'poster') && (
              <AutoCarousel
                year={section.year}
                posters={section.items.filter(i => i.type === 'poster')}
              />
            )}

            {/* Render Tables */}
            {section.items.some(i => i.type === 'table') && (
              <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-[0_10px_50px_rgba(76,29,149,0.05)] border border-purple-50 p-8 md:p-12 overflow-hidden mt-8">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-primary/50 text-[10px] uppercase tracking-widest border-b border-purple-50">
                        <th className="pb-6 font-bold">Designation</th>
                        <th className="pb-6 font-bold">Name</th>
                      </tr>
                    </thead>
                    <tbody className="text-primary">
                      {section.items.filter(i => i.type === 'table').map((member, mIdx) => (
                        <tr key={mIdx} className="group hover:bg-purple-50/30 transition-colors duration-300">
                          <td className="py-6 pr-4 font-bold text-sm md:text-base border-b border-purple-50/50">{member.position}</td>
                          <td className="py-6 text-sm md:text-base border-b border-purple-50/50 group-hover:pl-2 transition-all duration-300">{member.name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExecutiveCommittee;
