import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ExComCard from '../components/ExComCard';
import { getExComMembers } from '../services/excomService';
import { excomData as mockData } from '../utils/excomData';
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
      const data = await getExComMembers();
      if (data.length > 0) {
        setMembers(data);
      } else {
        // Fallback to mock data if Firestore is empty
        // In production, you would typically seed Firestore once
        setMembers(mockData.flatMap(yearGroup => 
          yearGroup.members.map(m => ({
            ...m,
            year: yearGroup.year,
            type: yearGroup.type || 'card',
            status: yearGroup.status || ''
          }))
        ));
      }
      setTimeout(() => setIsReady(true), 100);
    } catch (error) {
      console.error('Error fetching members:', error);
      // Fallback on error too
      setMembers(mockData.flatMap(yearGroup => 
        yearGroup.members.map(m => ({
          ...m,
          year: yearGroup.year,
          type: yearGroup.type || 'card',
          status: yearGroup.status || ''
        }))
      ));
      setTimeout(() => setIsReady(true), 100);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  // Group members by year for rendering
  const yearGroups = [...new Set(members.map(m => m.year))].sort().reverse().map(year => {
    const yearMembers = members.filter(m => m.year === year);
    return {
      year,
      status: yearMembers[0]?.status || '',
      type: yearMembers[0]?.type || 'card',
      members: yearMembers
    };
  });

  return (
    <div className="bg-[#F5EFFF] min-h-screen font-sans">
      {/* Header Section */}
      <section className="py-16 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-purple-100 shadow-sm mb-6 transition-all duration-1000 ${isReady ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></div>
            <span className="text-[10px] md:text-xs font-semibold tracking-widest text-primary/80 uppercase">
              Leadership
            </span>
          </div>

          <h1 className={`text-4xl md:text-5xl font-bold text-primary mb-6 font-serif transition-all duration-1000 delay-200 ${isReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Executive Committee
          </h1>

          <p className={`text-gray-600 text-sm md:text-base leading-relaxed max-w-2xl mx-auto transition-all duration-1000 delay-500 ${isReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Meet the dedicated leaders driving the vision and initiatives of WIE SUSL. Our executive committee is committed to empowering women in STEM and fostering a community of innovation and excellence.
          </p>
        </div>
      </section>

      {/* ExCom Sections */}
      <div className="container mx-auto px-4 pb-20 space-y-12">
        {yearGroups.map((section, idx) => (
          <div 
            key={section.year} 
            className={`bg-[#F9F6FF] rounded-[2rem] p-8 md:p-12 shadow-sm transition-all duration-1000 ${isReady ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            style={{ transitionDelay: `${idx * 200 + 700}ms` }}
          >
            <div className="flex justify-between items-center mb-10">
              <div className="flex-1"></div>
              <div className="text-center flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-primary font-serif">{section.year}</h2>
                {section.status && (
                  <span className="text-xs font-medium text-gray-500 mt-1 block">({section.status})</span>
                )}
              </div>
              <div className="flex-1 flex justify-end">
                {isAdmin && (
                  <button 
                    className="p-2 bg-white rounded-full shadow-sm text-primary hover:bg-purple-50 transition-colors"
                    title="Edit Section"
                    onClick={() => navigate('/admin/excom')}
                  >
                    <Icon icon="mdi:pencil" width={20} />
                  </button>
                )}
              </div>
            </div>

            {section.type === 'table' ? (
              <div className="max-w-3xl mx-auto overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-primary border-b border-purple-100">
                      <th className="py-4 font-semibold">Designation</th>
                      <th className="py-4 font-semibold">Name</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    {section.members.map((member, mIdx) => (
                      <tr key={mIdx} className="border-b border-purple-50 last:border-0 hover:bg-white/50 transition-colors">
                        <td className="py-4 text-sm font-medium">{member.position}</td>
                        <td className="py-4 text-sm">{member.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                {/* Top member (Chairperson usually) */}
                <div className="mb-8 w-full max-w-xs">
                  {section.members.filter(m => m.isTop).map((member, mIdx) => (
                    <ExComCard key={mIdx} {...member} />
                  ))}
                </div>
                
                {/* Other members */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
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
