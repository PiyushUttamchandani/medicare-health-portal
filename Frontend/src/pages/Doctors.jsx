import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Added for navigation
import axios from "axios";
import { Stethoscope, Award, User } from "lucide-react";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // ✅ Hook initialize kiya

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        // ✅ Database se fresh doctors list fetch ki
        const res = await axios.get("http://localhost:5000/api/auth/all-doctors");
        setDoctors(res.data);
      } catch (err) {
        console.error("Error fetching doctors", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-black text-slate-900 italic">
          Our Medical <span className="text-primary">Specialists</span>
        </h2>
        <p className="text-slate-400 font-bold text-sm uppercase mt-2 tracking-widest">
          Expert care from qualified professionals
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-10">
          {doctors.map((doc) => (
            <div key={doc._id} className="bg-white rounded-[3rem] shadow-xl border border-slate-50 hover:scale-[1.03] transition-all duration-500 overflow-hidden group">

              {/* ✅ Doctor Image Section */}
              <div className="h-64 w-full bg-slate-100 relative overflow-hidden">
                {doc.image ? (
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-200">
                    <User size={60} className="text-slate-400" />
                  </div>
                )}
                <div className="absolute bottom-4 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg">
                  <p className="text-primary font-black text-[10px] uppercase tracking-widest">
                    {doc.specialization || "Expert Specialist"}
                  </p>
                </div>
              </div>

              <div className="p-8">
                <h3 className="text-2xl font-black text-slate-900 italic mb-2">Dr. {doc.name}</h3>

                <div className="flex items-center gap-2 text-slate-500 text-sm font-bold mb-6">
                  <Award size={18} className="text-primary" />
                  {doc.experience || "Verified"} Professional Experience
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <Stethoscope className="text-primary" size={24} />
                  </div>

                  {/* ✅ Merged Navigate Logic: Details automatic Appointment page par jayengi */}
                  <button
                    onClick={() => navigate("/appointment", {
                      state: {
                        service: doc.specialization,
                        doctorName: doc.name,
                        doctorId: doc._id
                      }
                    })}
                    className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold flex-1 hover:bg-primary transition-all active:scale-95 shadow-lg"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && doctors.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-bold italic text-lg">Our specialists are currently unavailable.</p>
        </div>
      )}
    </div>
  );
};

export default Doctors;