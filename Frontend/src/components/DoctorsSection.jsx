import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Stethoscope, ArrowRight, Award, Loader2, Calendar } from "lucide-react";

const DoctorsSection = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ 1. Database se Fresh Doctors fetch karein
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        // Backend endpoint for all doctors
        const res = await axios.get("http://localhost:5000/api/auth/all-doctors");
        // Home page par sirf top 4 doctors dikhayenge
        setDoctors(res.data.slice(0, 4)); 
      } catch (err) {
        console.error("Error fetching doctors:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 text-left">
          <div className="max-w-xl">
            <span className="text-primary font-black text-[10px] uppercase tracking-[0.3em] mb-4 block">
              Our Specialists
            </span>
            <h2 className="text-5xl font-black text-slate-900 italic leading-tight tracking-tight">
              Meet Our <span className="text-primary">World-Class</span> Experts
            </h2>
          </div>
          <button 
            onClick={() => navigate("/doctors")}
            className="group px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs flex items-center gap-3 hover:bg-primary transition-all shadow-xl active:scale-95"
          >
            VIEW ALL DOCTORS <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* ✅ DYNAMIC DOCTORS GRID */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {doctors.map((doc) => (
            <div
              key={doc._id}
              className="group bg-slate-50 rounded-[3rem] p-4 pb-8 border border-transparent hover:border-primary/20 hover:bg-white hover:shadow-2xl transition-all duration-500"
            >
              {/* Doctor Image */}
              <div className="relative overflow-hidden rounded-[2.5rem] h-72 mb-6">
                <img
                  src={doc.image || "https://via.placeholder.com/400x500"}
                  alt={doc.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-lg transform translate-y-12 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 text-center">
                   <p className="text-[10px] font-black text-primary uppercase tracking-widest">
                    Available for Consultation
                   </p>
                </div>
              </div>

              <div className="px-4 text-center">
                <h3 className="text-2xl font-black text-slate-900 italic tracking-tight">
                  Dr. {doc.name}
                </h3>
                <p className="text-primary font-bold text-sm mt-1 uppercase tracking-wider">
                  {doc.specialization}
                </p>

                <div className="flex items-center justify-center gap-2 text-slate-400 font-bold text-[10px] mt-4 mb-6 uppercase">
                  <Award size={14} className="text-primary" />
                  {doc.experience || "Verified"} Experience
                </div>

                {/* ✅ ACTION BUTTONS */}
                <div className="flex flex-col gap-3">
                  {/* FIX: Is path ko exactly '/appointment' rakha hai taaki profile na khule */}
                  <button
                    onClick={() => navigate("/appointment", { 
                      state: { 
                        service: doc.specialization, 
                        doctorName: doc.name,
                        doctorId: doc._id 
                      } 
                    })}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Calendar size={16} /> Book Appointment
                  </button>
                  
                  <button
                    onClick={() => navigate(`/doctor/${doc._id}`)}
                    className="w-full py-3 bg-transparent border-2 border-slate-100 rounded-2xl text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-900 hover:border-slate-900 transition-all"
                  >
                    View Full Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {doctors.length === 0 && (
          <div className="text-center py-20 text-slate-400 font-bold italic">
            No doctors found in the registry.
          </div>
        )}
      </div>
    </section>
  );
};

export default DoctorsSection;