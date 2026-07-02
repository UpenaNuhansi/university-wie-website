import React from 'react';
import { useInView } from '../../hooks/useInView';

const milestones = [
  {
    year: '01',
    title: 'PearlHack 3.0',
    description: 'Largest women’s hackathon by IEEE WIE SUSL, held alongside the ICARC International Conference on Advanced Research in Computing. Featured Ideathon and Designathon phases, supported by workshops that equipped participants with essential skills to bring ideas to life.',
    links: [
      { label: 'Facebook', href: 'https://www.facebook.com/100069740625048/posts/971998438468168/?mibextid=rS40aB7S9Ucbxw6v' }
    ]
  },
  {
    year: '02',
    title: 'PathForward V2.0',
    description: 'Inspiring panel discussion with industry experts sharing real-world experiences and career guidance. Focused on helping interns and undergraduates navigate the evolving IT landscape and shape future career paths.',
    links: [
      { label: 'Facebook', href: 'https://www.facebook.com/share/p/1L3np2Nj52/?mibextid=oFDknk' }
    ]
  },
  {
    year: '03',
    title: 'VisionX E-Magazine',
    description: 'Final phase of the VisionX Top 10 Article Competition, featuring IoT-focused articles. First-ever magazine published by IEEE WIE SUSL and available on the Faculty of Computing’s official website.',
    links: [
      { label: 'Facebook', href: 'https://web.facebook.com/100069740625048/posts/1053224873678857/?mibextid=rS40aB7S9Ucbxw6v&_rdc=1&_rdr' },
      { label: 'E-Magazine', href: 'https://www.sab.ac.lk/computing/student-societies/IEEE-WIE-Affinity-Group-magazine' }
    ]
  },
  {
    year: '04',
    title: 'Hope 2.0',
    description: 'Outreach initiative empowering underprivileged rural students through technology-based education. Combined engaging sessions, mentorship, and the creation of school-based tech clubs like CodeLab.',
    links: [
      { label: 'Facebook', href: 'https://www.facebook.com/share/v/16nKpCrgWK/?mibextid=oFDknk' }
    ]
  },
  {
    year: '05',
    title: 'ArtXplore',
    description: 'Poster design competition for ages 14–30, jointly organized by the IEEE WIE Affinity Groups of Sabaragamuwa University of Sri Lanka and the University of Peradeniya. Showcased creativity in digital and hand-drawn art through an IEEE-supported platform.',
    links: [
      { label: 'Facebook', href: 'https://www.facebook.com/share/p/1fkdmabTKp/?mibextid=xfxF2i' }
    ]
  },
  {
    year: '06',
    title: 'PathForward V1.0',
    description: 'Session on “Navigating the Culture of the IT Industry.” Empowered undergraduates in Sri Lanka with knowledge, skills, and opportunities to integrate into fast-paced tech environments.',
    links: [
      { label: 'Facebook', href: 'https://www.facebook.com/share/p/1UbEa5wkNp/?mibextid=oFDknk' }
    ]
  },
  {
    year: '07',
    title: 'PearlHack 2.0',
    description: 'Largest women’s hackathon by IEEE WIE SUSL, held alongside the ICARC International Conference on Advanced Research in Computing. Featured Ideathon and Designathon phases, supported by workshops that equipped participants with essential skills to bring ideas to life.',
    links: [
      { label: 'Facebook', href: 'https://www.facebook.com/100064687987174/posts/827114802788112/?mibextid=rS40aB7S9Ucbxw6v' },
      { label: 'PearlHack 2.0', href: 'https://pearl-hack-2-0.vercel.app/' }
    ]
  },
  {
    year: '08',
    title: 'VisionX',
    description: 'IoT-focused article competition to promote innovation and learning. Included webinars, mini ideathons, and article writing, and recognized top contributors for excellence in emerging tech.',
    links: [
      { label: 'Facebook', href: 'https://www.facebook.com/100069740625048/posts/891525649848781/?mibextid=rS40aB7S9Ucbxw6v' }
    ]
  },
  {
    year: '09',
    title: 'A Hope 1.0',
    description: 'Charitable initiative supporting underprivileged students. Donated books to school libraries to enhance education and inspire dreams through meaningful opportunities.',
    links: [
      { label: 'Facebook', href: 'https://www.facebook.com/share/p/1AtXpvNzjW/?mibextid=xfxF2i' }
    ]
  },
  {
    year: '10',
    title: 'Aurelia 1.0',
    description: 'Celebration of WIE Day honoring women in engineering and technology. Featured inspirational talks, networking sessions, and collaborative activities that encouraged leadership, innovation, and community building.',
    links: [
      { label: 'Facebook', href: 'https://www.facebook.com/100064687987174/posts/941165698049688/?mibextid=rS40aB7S9Ucbxw6v' }
    ]
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
                  {item.links && item.links.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-3">
                      {item.links.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-4 py-2 text-sm font-semibold text-primary transition-colors duration-300 hover:bg-purple-100 hover:border-purple-300"
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  )}
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
