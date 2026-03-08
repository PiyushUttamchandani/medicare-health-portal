import React from "react";

const StatsSection = () => {
  const stats = [
    { label: "Patients Served", count: "15K+" },
    { label: "Expert Doctors", count: "120+" },
    { label: "Success Rate", count: "98%" },
    { label: "Experience", count: "10+ Yrs" },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 -mt-16 relative z-10 animate-in fade-in slide-in-from-bottom-10 duration-700">
      <div className="bg-slate-900 rounded-[3rem] p-10 md:p-14 grid grid-cols-2 lg:grid-cols-4 gap-8 shadow-2xl shadow-primary/20 border border-slate-800">
        {stats.map((stat, i) => (
          <div key={i} className="text-center border-r last:border-none border-slate-800/50">
            <p className="text-4xl md:text-5xl font-black text-white italic mb-2 tracking-tighter">
              {stat.count}
            </p>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;