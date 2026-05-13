import React, { useEffect } from 'react';
import HeroSection from '../components/About/HeroSection';
import AboutSection from '../components/About/AboutSection';
import MissionVision from '../components/About/MissionVision';
import StatsSection from '../components/About/StatsSection';
import StorySection from '../components/About/StorySection';

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero / Banner Section */}
      <HeroSection />

      {/* About WIE Section (Who We Are) */}
      <AboutSection />

      {/* Mission / Vision Section */}
      <MissionVision />

      {/* Achievements / Stats Section */}
      <StatsSection />

      {/* Our Story / Timeline Section */}
      <StorySection />
    </div>
  );
};

export default About;
