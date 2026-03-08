import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="bg-gradient-to-b from-slate-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-20 lg:py-32 grid md:grid-cols-2 gap-16 items-center">
        
        {/* LEFT CONTENT */}
        <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold border border-emerald-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Available 24/7 for Emergencies
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
            Your Health, <br />
            <span className="text-primary italic font-medium">Our Priority.</span>
          </h1>

          <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
            Experience a new standard of healthcare with personalized treatment plans and 
            cutting-edge medical technology.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/appointment"
              className="bg-primary text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform text-center"
            >
              Book Appointment
            </Link>

            <Link
              to="/doctors"
              className="bg-white border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-xl font-bold hover:bg-slate-50 transition-colors text-center"
            >
              Meet Our Specialists
            </Link>
          </div>

          {/* QUICK STATS / TRUST ANCHOR */}
          <div className="flex items-center gap-8 pt-6 border-t border-slate-100">
            <div>
              <p className="text-2xl font-bold text-slate-900">15k+</p>
              <p className="text-sm text-slate-500">Happy Patients</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">98%</p>
              <p className="text-sm text-slate-500">Success Rate</p>
            </div>
          </div>
        </div>

        {/* RIGHT IMAGE WITH DECORATION */}
        <div className="relative group">
          <div className="absolute -inset-4 bg-primary/5 rounded-[2.5rem] -rotate-2 group-hover:rotate-0 transition-transform duration-500"></div>
          <img
            src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3"
            alt="Modern Medical Center"
            className="relative rounded-[2rem] shadow-2xl z-10 object-cover min-h-[400px]"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;