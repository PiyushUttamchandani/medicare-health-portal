import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, Stethoscope, Briefcase, Award, Loader2, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ 1. Database se Doctors fetch karne ka logic
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      // Sabhi users fetch karein
      const res = await axios.get("http://localhost:5000/api/auth/all-users");
      // Sirf jinka role 'doctor' hai unhe filter karein
      const doctorList = res.data.filter(user => user.role === 'doctor');
      setDoctors(doctorList);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // ✅ 2. Existing Doctor ko delete karne ka logic
  const deleteDoctor = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove Dr. ${name}?`)) {
      try {
        await axios.delete(`http://localhost:5000/api/auth/delete-user/${id}`);
        alert("Doctor removed successfully!");
        fetchDoctors(); // List refresh karein
      } catch (err) {
        alert("Failed to delete doctor");
      }
    }
  };

  return (
    <div className="p-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 italic tracking-tight">
            Manage <span className="text-primary">Doctors</span>
          </h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-1">
            Total Specialists: {doctors.length}
          </p>
        </div>
        
        {/* Naya Doctor Add karne ke liye redirect button */}
        <button 
          onClick={() => navigate("/admin/add-doctor")} // Aapka alag page path
          className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-primary transition-all shadow-xl shadow-slate-200 active:scale-95"
        >
          <UserPlus size={20} /> ADD NEW DOCTOR
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((doc) => (
            <div key={doc._id} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-50 relative group overflow-hidden transition-all hover:shadow-2xl hover:shadow-slate-200">
              
              {/* Delete Button - Top Right */}
              <button 
                onClick={() => deleteDoctor(doc._id, doc.name)}
                className="absolute top-6 right-6 p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
              >
                <Trash2 size={18} />
              </button>

              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Stethoscope className="text-primary" size={28} />
              </div>

              <h3 className="text-xl font-black text-slate-800 italic">Dr. {doc.name}</h3>
              
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-wider">
                  <Briefcase size={14} className="text-primary" />
                  {doc.specialization || "General Specialist"}
                </div>
                <div className="flex items-center gap-2 text-slate-400 font-medium text-sm">
                  <Award size={14} className="text-slate-300" />
                  {doc.experience || "Not Specified"} Exp.
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-50">
                <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Login Identity</div>
                <div className="text-slate-500 text-sm font-bold truncate mt-1">{doc.email}</div>
              </div>

            </div>
          ))}
        </div>
      )}

      {!loading && doctors.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-bold italic">No doctors found in the system.</p>
        </div>
      )}
    </div>
  );
};

export default AdminDoctors;