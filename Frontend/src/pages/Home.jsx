import React, { useEffect } from "react";
import Hero from "../components/Hero";
import ServicesSection from "../components/ServicesSection";
import DoctorsSection from "../components/DoctorsSection";
import StatsSection from "../components/StatsSection"; 
import WhyChooseUs from "../components/WhyChooseUs"; 

const Home = () => {
  useEffect(() => {
    // Page load hote hi screen top par scroll ho jaye
    window.scrollTo(0, 0); 
  }, []);

  return (
    <div className="bg-white overflow-hidden">
      {/* 🚀 1. Hero: Main landing banner */}
      <Hero />

      {/* 📊 2. Stats: Trust builders (15K+ Patients, etc.) */}
      <StatsSection />

      {/* 🏥 3. Services: Dynamic departments from Admin */}
      <div className="bg-slate-50/50 py-10">
        <ServicesSection />
      </div>

      {/* 🛡️ 4. Why Choose Us: Features & Benefits section */}
      <WhyChooseUs />

      {/* 🩺 5. Doctors: Dynamic Specialists from Database */}
      {/* Note: Is file ke andar se purana 'Meet Our Specialists' wala static code delete kar dena */}
      <div className="bg-white py-10">
        <DoctorsSection />
      </div>
    </div>
  );
};

export default Home;