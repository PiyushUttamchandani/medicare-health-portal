import React from "react";
import { ShieldCheck, Clock, Award, HeartPulse } from "lucide-react";

const WhyChooseUs = () => {
  const features = [
    { icon: <ShieldCheck />, title: "Secure Data", desc: "Your health records are encrypted." },
    { icon: <Clock />, title: "24/7 Support", desc: "Emergency care available anytime." },
    { icon: <Award />, title: "Certified", desc: "Board-certified medical experts." },
    { icon: <HeartPulse />, title: "Patient Care", desc: "Personalized recovery plans." },
  ];

  return (
    <section className="bg-slate-900 py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <span className="text-primary font-black text-[10px] uppercase tracking-[0.3em] mb-4 block">Why Medicare</span>
            <h2 className="text-5xl font-black text-white italic leading-tight mb-8">
              We Are Setting The <span className="text-primary">Standard</span> In Care
            </h2>
            <p className="text-slate-400 text-lg font-medium leading-relaxed mb-10">
              Our commitment to medical excellence ensures that every patient receives 
              world-class treatment using the latest technology.
            </p>
            <div className="grid sm:grid-cols-2 gap-8">
              {features.map((f, i) => (
                <div key={i} className="flex gap-4">
                  <div className="text-primary mt-1">{f.icon}</div>
                  <div>
                    <h4 className="text-white font-black italic text-sm mb-1">{f.title}</h4>
                    <p className="text-slate-500 text-xs font-bold leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-4 bg-primary/20 rounded-[4rem] blur-2xl group-hover:bg-primary/30 transition-all duration-700"></div>
            <img 
              src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2000" 
              alt="Medical Tech" 
              className="relative rounded-[4rem] shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-700 object-cover h-[500px] w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;