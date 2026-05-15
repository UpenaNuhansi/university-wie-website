import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ExComCard from '../components/ExComCard';
import { getExComMembers } from '../services/excomService';
import { excomData as mockData } from '../utils/excomData';
import { getDynamicExComMembers } from '../utils/dynamicExCom';
import { useAuth } from '../hooks/useAuth';
import { Icon } from '@iconify/react';
import Loader from '../components/Loader';

const ExecutiveCommittee = () => {
  const navigate = useNavigate();
  const [isReady, setIsReady] = useState(false);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth() || {}; 
  const isAdmin = !!user;

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const firestoreData = await getExComMembers();
      
      // Get dynamic members from assets for 2025/26
      const dynamicMembers = getDynamicExComMembers().map(m => ({
        ...m,
        year: "2025/2026",
        status: "Current Excom",
        type: 'card'
      }));

      let finalMembers = [];

      if (firestoreData.length > 0) {
        // If firestore has data, we might want to prioritize it, 
        // but the user specifically asked to use the images for 2025/26.
        // So we filter out 2025/26 from firestore if it exists and use dynamic instead.
        const otherYears = firestoreData.filter(m => m.year !== "2025/2026");
        finalMembers = [...dynamicMembers, ...otherYears];
      } else {
        // Fallback to mock data for other years
        const otherYearsMock = mockData
          .filter(yearGroup => yearGroup.year !== "2025/2026")
          .flatMap(yearGroup => 
            yearGroup.members.map(m => ({
              ...m,
              year: yearGroup.year,
              type: yearGroup.type || 'card',
              status: yearGroup.status || ''
            }))
          );
        finalMembers = [...dynamicMembers, ...otherYearsMock];
      }

      setMembers(finalMembers);
      setTimeout(() => setIsReady(true), 100);
    } catch (error) {
      console.error('Error fetching members:', error);
      // Fallback on error
      const dynamicMembers = getDynamicExComMembers().map(m => ({
        ...m,
        year: "2025/2026",
        status: "Current Excom",
        type: 'card'
      }));
      
      const otherYearsMock = mockData
        .filter(yearGroup => yearGroup.year !== "2025/2026")
        .flatMap(yearGroup => 
          yearGroup.members.map(m => ({
            ...m,
            year: yearGroup.year,
            type: yearGroup.type || 'card',
            status: yearGroup.status || ''
          }))
        );
      
      setMembers([...dynamicMembers, ...otherYearsMock]);
      setTimeout(() => setIsReady(true), 100);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  // Group members by year for rendering
  const yearGroups = [...new Set(members.map(m => m.year))].sort((a, b) => {
    // Custom sort for academic years like "2025/2026"
    return b.localeCompare(a);
  }).map(year => {
    const yearMembers = members.filter(m => m.year === year);
    return {
      year,
      status: yearMembers[0]?.status || '',
      type: yearMembers[0]?.type || 'card',
      members: yearMembers
    };
  });

  return (
    <div className="bg-[#FDFBFF] min-h-screen font-sans overflow-hidden">
      {/* Header Section */}
      <section className="relative pt-24 pb-16 px-6 text-center overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purpleLight rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purpleLight rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-purple-100 mb-8 transition-all duration-1000 ${isReady ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
            <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-primary uppercase">
              Our Leadership Team
            </span>
          </div>

          <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold text-primary mb-8 font-serif transition-all duration-1000 delay-200 ${isReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Executive <span className="text-accent italic">Committee</span>
          </h1>

          <p className={`text-gray-500 text-base md:text-lg leading-relaxed max-w-2xl mx-auto transition-all duration-1000 delay-500 ${isReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            The brilliant minds behind WIE SUSL, working together to inspire, 
            empower, and lead the next generation of women in engineering.
          </p>
        </div>
      </section>

      {/* ExCom Sections */}
      <div className="container mx-auto px-4 pb-32 space-y-24">
        {yearGroups.map((section, idx) => (
          <div 
            key={section.year} 
            className={`transition-all duration-1000 ${isReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
            style={{ transitionDelay: `${idx * 200 + 700}ms` }}
          >
            {/* Section Header */}
            <div className="flex flex-col items-center mb-16 relative">
              <div className="absolute inset-0 flex items-center justify-center -z-10">
                <div className="h-px w-full max-w-lg bg-gradient-to-r from-transparent via-purple-100 to-transparent"></div>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-primary font-serif bg-[#FDFBFF] px-8 py-2 relative">
                {section.year}
                {isAdmin && (
                  <button 
                    className="absolute -right-4 top-0 p-2 bg-white rounded-full shadow-md text-primary hover:bg-primary hover:text-white transition-all duration-300 scale-75"
                    title="Edit Section"
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

            {section.type === 'table' ? (
              <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-[0_10px_50px_rgba(76,29,149,0.05)] border border-purple-50 p-8 md:p-12 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-primary/50 text-[10px] uppercase tracking-widest border-b border-purple-50">
                        <th className="pb-6 font-bold">Designation</th>
                        <th className="pb-6 font-bold">Name</th>
                      </tr>
                    </thead>
                    <tbody className="text-primary">
                      {section.members.map((member, mIdx) => (
                        <tr key={mIdx} className="group hover:bg-purple-50/30 transition-colors duration-300">
                          <td className="py-6 pr-4 font-bold text-sm md:text-base border-b border-purple-50/50">{member.position}</td>
                          <td className="py-6 text-sm md:text-base border-b border-purple-50/50 group-hover:pl-2 transition-all duration-300">{member.name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                {/* Top member (Chairperson) */}
                <div className="mb-12 w-full flex justify-center">
                  {section.members.filter(m => m.isTop).map((member, mIdx) => (
                    <div key={mIdx} className="w-full max-w-sm">
                      <ExComCard {...member} />
                    </div>
                  ))}
                </div>
                
                {/* Other members - Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10 w-full max-w-7xl px-4">
                  {section.members.filter(m => !m.isTop).map((member, mIdx) => (
                    <ExComCard key={mIdx} {...member} />
                  ))}
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
