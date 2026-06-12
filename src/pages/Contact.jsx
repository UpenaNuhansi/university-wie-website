// src/pages/Contact.jsx
import React, { useEffect, useState } from "react";
import contactHeroBg from "../assets/contact/hero-bg.jpg";
import { submitContactMessage } from "../services/contactService";
import { useInView } from "../hooks/useInView";

const Contact = () => {
  const [heroReady, setHeroReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setHeroReady(true), 120);
    return () => clearTimeout(t);
  }, []);

  const [leftRef, leftVisible] = useInView(0.12);
  const [rightRef, rightVisible] = useInView(0.12);

  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
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
      setError("Email address is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!form.subject.trim()) {
      setError("Subject is required");
      return;
    }
    if (!form.message.trim()) {
      setError("Message cannot be empty");
      return;
    }

    try {
      setLoading(true);
      await submitContactMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
      });
      setForm({ name: "", email: "", subject: "", message: "" });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 6000);
    } catch (err) {
      console.error("Error submitting contact form:", err);
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const socialIcons = {
    facebook: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>,
    instagram: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>,
    linkedin: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>,
    email: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,4 12,13 2,4"/></svg>,
  };

  return (
    <div className="bg-purpleLight min-h-screen font-sans pt-6 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[420px] md:min-h-[480px] flex items-end rounded-b-[2rem] mx-4 md:mx-8 lg:mx-12 shadow-2xl">
        <img 
          src={contactHeroBg} 
          alt="Contact Us" 
          className={`absolute inset-0 w-full h-full object-cover object-[center_30%] transition-transform duration-[10000ms] ${heroReady ? 'scale-105' : 'scale-100'}`} 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-purpleDark/80 via-primary/60 to-accent/40" />
        
        <div className="relative z-10 p-8 md:p-12 lg:p-16 max-w-3xl">
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-sm mb-6 transition-all duration-1000 ${heroReady ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></div>
            <span className="text-[10px] md:text-xs font-semibold tracking-widest text-white uppercase font-sans">
              Get in Touch
            </span>
          </div>
          
          <h1 className={`text-3xl md:text-5xl font-bold text-white mb-6 leading-tight font-serif transition-all duration-1000 delay-200 ${heroReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Contact <span className="text-pink-300 font-accentFont font-normal">Us</span>
          </h1>
          
          <p className={`text-white/80 text-sm md:text-base leading-relaxed max-w-xl mb-4 font-medium transition-all duration-1000 delay-500 ${heroReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            We'd love to hear from you. Whether you have a question, a partnership proposal, or just want to say hello, feel free to reach out.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto py-12 md:py-20 px-6 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
        {/* Left Column: Contact Information */}
        <div 
          ref={leftRef} 
          className={`md:col-span-5 bg-white p-6 md:p-10 rounded-3xl border border-purple-100 shadow-sm hover:shadow-xl hover:shadow-purple-200/50 transition-all duration-1000 flex flex-col justify-between ${leftVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}
        >
          <div>
            <div className="w-10 h-0.5 bg-gradient-to-r from-accent to-purple-500 mb-4 rounded-full"></div>
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8 font-serif tracking-tight">Reach Out</h2>
            
            <div className="space-y-6">
              <div className="flex gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-purpleLight flex items-center justify-center border border-purple-100 shadow-sm group-hover:scale-110 transition-transform duration-300 shrink-0 text-accent">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <polyline points="22,4 12,13 2,4"/>
                  </svg>
                </div>
                <div>
                  <h4 className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest font-sans mb-1">Official Email</h4>
                  <p className="text-primary font-bold text-sm md:text-base font-sans break-all hover:text-accent transition-colors">
                    <a href="mailto:ieeewieagsusl@gmail.com">ieeewieagsusl@gmail.com</a>
                  </p>
                </div>
              </div>

              <div className="flex gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-purpleLight flex items-center justify-center border border-purple-100 shadow-sm group-hover:scale-110 transition-transform duration-300 shrink-0 text-accent">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div>
                  <h4 className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest font-sans mb-1">Location</h4>
                  <p className="text-gray-800 text-sm leading-relaxed font-sans">
                    Sabaragamuwa University of Sri Lanka<br />
                    P.O. Box 02, Belihuloya, 70140, Sri Lanka.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="h-px bg-purple-100 my-8" />
            <h3 className="text-xl font-bold text-primary mb-4 font-serif">Follow Us</h3>
            <div className="flex gap-3 flex-wrap">
              <a 
                href="https://www.facebook.com/IEEE.WIE.SUSL" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 bg-white border border-purple-100 rounded-2xl flex items-center justify-center text-primary hover:bg-accent hover:text-white hover:border-accent transition-all duration-300 shadow-sm hover:scale-105"
              >
                {socialIcons.facebook}
              </a>
              <a 
                href="https://www.instagram.com/ieee_wie_susl?igsh=aGFpc3F6c3FnczVs" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 bg-white border border-purple-100 rounded-2xl flex items-center justify-center text-primary hover:bg-accent hover:text-white hover:border-accent transition-all duration-300 shadow-sm hover:scale-105"
              >
                {socialIcons.instagram}
              </a>
              <a 
                href="https://www.linkedin.com/company/ieee-wie-student-branch-affinity-group-of-susl/" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 bg-white border border-purple-100 rounded-2xl flex items-center justify-center text-primary hover:bg-accent hover:text-white hover:border-accent transition-all duration-300 shadow-sm hover:scale-105"
              >
                {socialIcons.linkedin}
              </a>
              <a 
                href="mailto:ieeewieagsusl@gmail.com" 
                className="w-11 h-11 bg-white border border-purple-100 rounded-2xl flex items-center justify-center text-primary hover:bg-accent hover:text-white hover:border-accent transition-all duration-300 shadow-sm hover:scale-105"
              >
                {socialIcons.email}
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div 
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
              <h3 className="text-2xl font-bold text-primary mb-4 font-serif">Message Sent!</h3>
              <p className="text-gray-800 text-base leading-relaxed font-sans max-w-md">
                Thank you for contacting us. We will get back to you shortly.
              </p>
            </div>
          ) : (
            <>
              <div className="w-10 h-0.5 bg-gradient-to-r from-accent to-purple-500 mb-4 rounded-full"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2 font-serif tracking-tight">Send a Message</h2>
              <p className="text-gray-800 text-sm leading-relaxed mb-8 font-sans font-medium">
                Fill out the form below and our team will get back to you shortly.
              </p>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-semibold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-6">
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
                  <label className="text-xs md:text-sm font-semibold text-primary uppercase tracking-wider mb-2 font-sans" htmlFor="email">Email Address</label>
                  <input
                    id="email" name="email" type="email"
                    className="w-full px-4 py-3 bg-white border border-purple-100 rounded-2xl font-sans text-gray-800 outline-none transition-all duration-300 focus:border-accent focus:ring-4 focus:ring-accent/10 placeholder:text-gray-400"
                    placeholder="jane@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-xs md:text-sm font-semibold text-primary uppercase tracking-wider mb-2 font-sans" htmlFor="subject">Subject</label>
                  <input
                    id="subject" name="subject" type="text"
                    className="w-full px-4 py-3 bg-white border border-purple-100 rounded-2xl font-sans text-gray-800 outline-none transition-all duration-300 focus:border-accent focus:ring-4 focus:ring-accent/10 placeholder:text-gray-400"
                    placeholder="How can we help you?"
                    value={form.subject}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-xs md:text-sm font-semibold text-primary uppercase tracking-wider mb-2 font-sans" htmlFor="message">Message</label>
                  <textarea
                    id="message" name="message"
                    className="w-full px-4 py-3 bg-white border border-purple-100 rounded-2xl font-sans text-gray-800 outline-none transition-all duration-300 focus:border-accent focus:ring-4 focus:ring-accent/10 placeholder:text-gray-400 resize-none min-h-[140px]"
                    placeholder="Your message..."
                    value={form.message}
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
                      Sending…
                    </>
                  ) : (
                    <>Send Message →</>
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

export default Contact;