import React, { useState, useEffect } from "react";
import axios from "axios";
import { ArrowRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ServicesSection = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/all-services");
        setServices(res.data.slice(0, 3)); // Home page par sirf top 3 dikhao
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchServices();
  }, []);

  if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
        <div className="max-w-xl">
          <span className="text-primary font-black text-[10px] uppercase tracking-[0.3em] mb-4 block">Medical Excellence</span>
          <h2 className="text-5xl font-black text-slate-900 italic leading-tight">Our Specialized <span className="text-primary">Healthcare</span> Departments</h2>
        </div>
        <button onClick={() => navigate("/services")} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm flex items-center gap-3 hover:bg-primary transition-all">
          VIEW ALL SERVICES <ArrowRight size={18} />
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {services.map((s) => (
          <div key={s._id} className="p-10 bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-all duration-500 border border-slate-50 group">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-white transition-all">
               <span className="text-3xl font-bold">🩺</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-4 italic">{s.name}</h3>
            <p className="text-slate-500 font-medium mb-8 line-clamp-2">{s.description}</p>
            <button onClick={() => navigate("/appointment", { state: { service: s.name } })} className="text-primary font-black text-xs uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
              Book Department <ArrowRight size={16} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
export default ServicesSection;