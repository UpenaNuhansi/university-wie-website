import React, { useEffect, useState } from "react";
import heroBg from "../assets/volunteer/heroBg.jpg";
import volunteersIllustration from "../assets/volunteer/img-2.jpg";
import { submitVolunteerForm } from "../services/volunteerService";
import { useInView } from "../hooks/useInView";

const reasons = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
      </svg>
    ),
    title: "Gain Experience",
    desc: "Develop leadership, event management, and technical skills in a supportive, real-world environment.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: "Networking",
    desc: "Connect with industry professionals, academic leaders, and like-minded peers across the university.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
    title: "Community Impact",
    desc: "Play a direct role in empowering women in STEM and fostering a more inclusive tech community.",
  },
];

const Volunteer = () => {
  const [heroReady, setHeroReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setHeroReady(true), 120);
    return () => clearTimeout(t);
  }, []);

  const [leftRef, leftVisible] = useInView(0.12);
  const [rightRef, rightVisible] = useInView(0.12);

  const [form, setForm] = useState({ name: "", email: "", dept: "", skills: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Full name is required");
      return;
    }
    if (!form.email.trim()) {
      setError("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!form.dept.trim()) {
      setError("Department & Batch is required");
      return;
    }
    if (!form.skills.trim()) {
      setError("Please tell us about your skills");
      return;
    }

    try {
      setLoading(true);
      await submitVolunteerForm({
        name: form.name.trim(),
        email: form.email.trim(),
        major: form.dept.trim(),
        experience: form.skills.trim(),
      });
      setForm({ name: "", email: "", dept: "", skills: "" });
      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-purpleLight min-h-screen font-sans pt-6 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[420px] md:min-h-[480px] flex items-end rounded-b-[2rem] mx-4 md:mx-8 lg:mx-12 shadow-2xl">
        <img 
          src={heroBg} 
          alt="Volunteers" 
          className={`absolute inset-0 w-full h-full object-cover object-top transition-transform duration-[10000ms] ${heroReady ? 'scale-105' : 'scale-100'}`} 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-purpleDark/80 via-primary/60 to-accent/40" />
        
        <div className="relative z-10 p-8 md:p-12 lg:p-16 max-w-3xl">
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-sm mb-6 transition-all duration-1000 ${heroReady ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></div>
            <span className="text-[10px] md:text-xs font-semibold tracking-widest text-white uppercase font-sans">
              Join the Team
            </span>
          </div>
          
          <h1 className={`text-3xl md:text-5xl font-bold text-white mb-6 leading-tight font-serif transition-all duration-1000 delay-200 ${heroReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Become an Event <span className="text-pink-300 font-accentFont font-normal">Volunteer</span>
          </h1>
          
          <p className={`text-white/80 text-sm md:text-base leading-relaxed max-w-xl mb-8 font-medium transition-all duration-1000 delay-500 ${heroReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Empower your peers, build your skills, and help us create unforgettable experiences for women in STEM at Sabaragamuwa University.
          </p>
          
          <button
            onClick={() => document.getElementById("vol-form").scrollIntoView({ behavior: "smooth" })}
            className={`px-8 py-3 bg-accent text-white font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-pink-500/30 font-sans cursor-pointer ${heroReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            Apply Now
          </button>
        </div>
      </section>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto py-12 md:py-20 px-6 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
        {/* Left Column: Why Volunteer */}
        <div 
          ref={leftRef} 
          className={`md:col-span-5 bg-white p-6 md:p-10 rounded-3xl border border-purple-100 shadow-sm hover:shadow-xl hover:shadow-purple-200/50 transition-all duration-1000 flex flex-col justify-between ${leftVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}
        >
          <div>
            <div className="w-10 h-0.5 bg-gradient-to-r from-accent to-purple-500 mb-4 rounded-full"></div>
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8 font-serif tracking-tight">Why Volunteer with Us?</h2>
            
            <div className="space-y-6">
              {reasons.map(({ icon, title, desc }) => (
                <div key={title} className="flex gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-purpleLight flex items-center justify-center border border-purple-100 shadow-sm group-hover:scale-110 transition-transform duration-300 shrink-0 text-accent">
                    {icon}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-primary font-sans mb-1">{title}</h4>
                    <p className="text-gray-800 text-sm leading-relaxed font-sans">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 relative group rounded-2xl overflow-hidden aspect-[4/3] w-full">
            <div className="absolute -inset-4 bg-gradient-to-tr from-accent to-primary rounded-2xl opacity-10 blur-xl group-hover:opacity-25 transition duration-500"></div>
            <img 
              src={volunteersIllustration} 
              alt="Volunteers illustration" 
              className="relative rounded-2xl shadow-md w-full h-full object-cover transform group-hover:scale-[1.02] transition-transform duration-500" 
            />
          </div>
        </div>

        {/* Right Column: Form */}
        <div 
          id="vol-form"
          ref={rightRef}
          className={`md:col-span-7 bg-white p-6 md:p-10 rounded-3xl border border-purple-100 shadow-sm hover:shadow-xl hover:shadow-purple-200/50 transition-all duration-1000 ${rightVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}
        >
          {submitted ? (
            <div className="text-center py-12 px-6 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-accent to-primary flex items-center justify-center mb-6 shadow-lg shadow-purple-200/50">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4 font-serif">Application Submitted!</h3>
              <p className="text-gray-800 text-base leading-relaxed font-sans max-w-md">
                Thank you for your interest in volunteering with IEEE WIE SUSL. We will review your application and get in touch with you shortly.
              </p>
            </div>
          ) : (
            <>
              <div className="w-10 h-0.5 bg-gradient-to-r from-accent to-purple-500 mb-4 rounded-full"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2 font-serif tracking-tight">Volunteer Application</h2>
              <p className="text-gray-800 text-sm leading-relaxed mb-8 font-sans font-medium">
                Fill out the form below to express your interest in joining our volunteer pool for upcoming events.
              </p>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-semibold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label className="text-xs md:text-sm font-semibold text-primary uppercase tracking-wider mb-2 font-sans" htmlFor="name">Full Name</label>
                    <input
                      id="name" name="name" type="text"
                      className="w-full px-4 py-3 bg-white border border-purple-100 rounded-2xl font-sans text-gray-800 outline-none transition-all duration-300 focus:border-accent focus:ring-4 focus:ring-accent/10 placeholder:text-gray-400"
                      placeholder="Jane Doe"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs md:text-sm font-semibold text-primary uppercase tracking-wider mb-2 font-sans" htmlFor="email">University Email</label>
                    <input
                      id="email" name="email" type="email"
                      className="w-full px-4 py-3 bg-white border border-purple-100 rounded-2xl font-sans text-gray-800 outline-none transition-all duration-300 focus:border-accent focus:ring-4 focus:ring-accent/10 placeholder:text-gray-400"
                      placeholder="jane@std.susl.lk"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-xs md:text-sm font-semibold text-primary uppercase tracking-wider mb-2 font-sans" htmlFor="dept">Department & Batch</label>
                  <input
                    id="dept" name="dept" type="text"
                    className="w-full px-4 py-3 bg-white border border-purple-100 rounded-2xl font-sans text-gray-800 outline-none transition-all duration-300 focus:border-accent focus:ring-4 focus:ring-accent/10 placeholder:text-gray-400"
                    placeholder="Computing & Information Systems, 18/19"
                    value={form.dept}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-xs md:text-sm font-semibold text-primary uppercase tracking-wider mb-2 font-sans" htmlFor="skills">Skills you can offer</label>
                  <textarea
                    id="skills" name="skills"
                    className="w-full px-4 py-3 bg-white border border-purple-100 rounded-2xl font-sans text-gray-800 outline-none transition-all duration-300 focus:border-accent focus:ring-4 focus:ring-accent/10 placeholder:text-gray-400 resize-none min-h-[120px]"
                    placeholder="E.g., Graphic Design, Public Speaking, Logistics Coordination..."
                    value={form.skills}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full py-4 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg shadow-purple-200/50 flex items-center justify-center gap-2 font-sans disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                      Submitting…
                    </>
                  ) : (
                    <>Submit Application →</>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Volunteer;