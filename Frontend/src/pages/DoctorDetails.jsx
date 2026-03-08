import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Award, ShieldCheck, ChevronLeft, Calendar, Loader2 } from "lucide-react";

const DoctorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ 1. Database se specific doctor fetch karne ka logic
  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/auth/all-doctors");
        const foundDoc = res.data.find((d) => d._id === id);
        setDoctor(foundDoc);
      } catch (err) {
        console.error("Error fetching doctor details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctorDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="py-40 flex justify-center items-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="py-40 text-center text-2xl font-bold text-slate-700">
        Doctor Not Found!
      </div>
    );
  }

  /* =======================
      BOOK APPOINTMENT
  ======================= */
  const handleBooking = () => {
    // ✅ User ko Appointment page par bhej rahe hain details ke saath
    // ⚠️ ProtectedRoute ki wajah se user ko pehle login karna hoga
    navigate("/appointment", {
      state: {
        service: state?.service || doctor.specialization, // Auto-fill specialization
        doctorName: doctor.name, // Auto-fill doctor name
        doctorId: doctor._id 
      },
    });
  };

  return (
    <div className="bg-white min-h-screen pt-28 pb-20">
      {/* HEADER SECTION (Navbar App.js se control ho raha hai) */}
      <div className="max-w-7xl mx-auto px-4">

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-primary mb-8 font-bold transition-all active:scale-95"
        >
          <ChevronLeft size={20} /> Back
        </button>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* IMAGE SECTION */}
          <div className="relative">
            <img
              src={doctor.image || "https://images.unsplash.com/photo-1550831107-1553da8c8464?w=800"}
              alt={doctor.name}
              className="w-full h-[600px] object-cover rounded-[3rem] shadow-2xl border-4 border-slate-50"
            />

            <div className="absolute -bottom-6 -right-6 bg-white p-8 rounded-3xl shadow-xl hidden md:block border border-slate-100 animate-in slide-in-from-right duration-700">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-2xl text-primary">
                  <Award size={32} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {doctor.experience}
                  </p>
                  <p className="text-sm text-slate-500 font-medium tracking-tight">
                    Professional Experience
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CONTENT SECTION */}
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-500">
            <div>
              <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                Board Certified Specialist
              </span>

              <h1 className="text-5xl font-black text-slate-900 mt-4 italic tracking-tight">
                Dr. {doctor.name}
              </h1>

              <p className="text-2xl text-primary font-bold mt-2">
                {doctor.specialization}
              </p>
            </div>

            <p className="text-lg text-slate-600 leading-relaxed font-medium">
              Dr. {doctor.name} is a highly experienced {doctor.specialization} specialist 
              with {doctor.experience} of clinical expertise, known for 
              delivering patient-focused medical care.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-6 bg-slate-50/50 border border-slate-100 rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary">
                  <Calendar size={20} />
                </div>
                <span className="text-slate-700 font-bold text-sm">
                  Mon – Sat (9am – 5pm)
                </span>
              </div>

              <div className="p-6 bg-slate-50/50 border border-slate-100 rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary">
                  <ShieldCheck size={20} />
                </div>
                <span className="text-slate-700 font-bold text-sm">
                  Verified Specialist
                </span>
              </div>
            </div>

            {/* BOOK BUTTON */}
            <button
              onClick={handleBooking}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xl hover:bg-primary transition-all shadow-xl shadow-slate-200 active:scale-95 flex items-center justify-center gap-3 uppercase tracking-tighter"
            >
              Confirm Appointment Now
            </button>
            
            <p className="text-center text-slate-400 text-xs font-bold uppercase tracking-widest italic">
              Consultation Fee will be discussed during the visit
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;