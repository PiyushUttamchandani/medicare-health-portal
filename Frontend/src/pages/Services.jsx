import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  Stethoscope, Heart, Brain, Baby, 
  Activity, Zap, Eye, Accessibility, Loader2, ArrowRight 
} from "lucide-react";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ 1. Database se saari Admin-added services fetch karein
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/auth/all-services");
        setServices(res.data);
      } catch (err) {
        console.error("Error fetching services:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Icon selector logic (Optional: Agar icon name database mein hai)
  const getIcon = (iconName) => {
    switch (iconName) {
      case "Heart": return <Heart size={32} />;
      case "Brain": return <Brain size={32} />;
      case "Baby": return <Baby size={32} />;
      default: return <Stethoscope size={32} />;
    }
  };

  if (loading) {
    return (
      <div className="py-40 flex justify-center items-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-5xl font-black text-slate-900 italic tracking-tight mb-6">
            Our Medical <span className="text-primary">Departments</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium">
            We provide specialized care through our various departments, 
            managed by world-class experts.
          </p>
        </div>

        {/* ✅ DYNAMIC SERVICES GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div 
              key={service._id} 
              className="group p-10 bg-slate-50 rounded-[3rem] border border-transparent hover:border-primary/20 hover:bg-white hover:shadow-2xl transition-all duration-500 cursor-pointer"
              onClick={() => navigate("/appointment", { state: { service: service.name } })}
            >
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-all duration-500 mb-8">
                {getIcon(service.iconName)}
              </div>

              <h3 className="text-2xl font-black text-slate-800 mb-4 italic">
                {service.name}
              </h3>

              <p className="text-slate-500 leading-relaxed font-medium mb-8">
                {service.description}
              </p>

              <div className="flex items-center gap-2 text-primary font-black text-sm uppercase tracking-widest group-hover:gap-4 transition-all">
                Book Department <ArrowRight size={18} />
              </div>
            </div>
          ))}
        </div>

        {/* EMPTY STATE */}
        {services.length === 0 && (
          <div className="text-center py-20 text-slate-400 font-bold">
            No services added yet by Admin.
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;