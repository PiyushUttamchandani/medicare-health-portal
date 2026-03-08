import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Trash2, UserPlus, Stethoscope, Briefcase, 
  Award, Loader2, X, ChevronRight, Mail, Lock, Image as ImageIcon, Upload 
} from "lucide-react";

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]); // ✅ Nayi state services ke liye
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [docData, setDocData] = useState({
    name: "",
    email: "",
    password: "",
    speciality: "", // ✅ Initial value empty rakhi hai
    experience: "",
    image: null 
  });

  // ✅ 1. Doctors aur Services dono fetch karein
  const fetchData = async () => {
    try {
      setLoading(true);
      const [docRes, serviceRes] = await Promise.all([
        axios.get("http://localhost:5000/api/auth/all-doctors"),
        axios.get("http://localhost:5000/api/auth/all-services") // ✅ Admin se add ki gayi services
      ]);
      setDoctors(docRes.data);
      setServices(serviceRes.data);
      
      // Default speciality set karein agar services available hain
      if (serviceRes.data.length > 0) {
        setDocData(prev => ({ ...prev, speciality: serviceRes.data[0].name }));
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", docData.name);
    data.append("email", docData.email);
    data.append("password", docData.password);
    data.append("speciality", docData.speciality);
    data.append("experience", docData.experience);
    
    if (docData.image) {
      data.append("image", docData.image); 
    } else {
      return alert("Please select a doctor photo from your PC");
    }

    try {
      await axios.post("http://localhost:5000/api/auth/admin-add-doctor", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("Doctor Onboarded Successfully!");
      setShowModal(false);
      setDocData({ name: "", email: "", password: "", speciality: services[0]?.name || "", experience: "", image: null });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.msg || "Registration Failed");
    }
  };

  const deleteDoctor = async (id, name) => {
    if (window.confirm(`Remove Dr. ${name} from the system?`)) {
      try {
        await axios.delete(`http://localhost:5000/api/auth/delete-doctor/${id}`);
        fetchData(); 
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  return (
    <div className="p-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 italic tracking-tight">
            Medical <span className="text-primary">Registry</span>
          </h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">
            Total Doctors: {doctors.length}
          </p>
        </div>
        
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-primaryDark transition-all shadow-xl shadow-primary/20 active:scale-95"
        >
          <UserPlus size={20} /> ONBOARD DOCTOR
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={40} /></div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((doc) => (
            <div key={doc._id} className="bg-white rounded-[2.5rem] shadow-xl border border-slate-50 relative group transition-all hover:shadow-2xl overflow-hidden">
              <div className="h-40 bg-slate-100 overflow-hidden relative">
                <img 
                  src={doc.image || "https://via.placeholder.com/400x200"} 
                  alt={doc.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <button 
                  onClick={() => deleteDoctor(doc._id, doc.name)}
                  className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-md"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="p-8 pt-6">
                <h3 className="text-xl font-black text-slate-800 italic">Dr. {doc.name}</h3>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                    <Briefcase size={14} className="text-primary" /> {doc.specialization || "General"}
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 font-medium text-sm">
                    <Award size={14} /> {doc.experience || "N/A"} Exp.
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl relative animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900 transition-colors">
              <X size={24} />
            </button>
            <h3 className="text-2xl font-black text-slate-900 mb-8 italic text-center">Register <span className="text-primary">Expert</span></h3>
            
            <form onSubmit={handleAddDoctor} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Full Name</label>
                <input type="text" placeholder="Dr. Name" required className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-primary outline-none font-bold" value={docData.name} onChange={(e) => setDocData({...docData, name: e.target.value})} />
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Specialization</label>
                {/* ✅ Dynamic Services Dropdown */}
                <select 
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-primary outline-none font-bold appearance-none cursor-pointer" 
                  value={docData.speciality} 
                  onChange={(e) => setDocData({...docData, speciality: e.target.value})}
                  required
                >
                  <option value="">Select Hospital Department</option>
                  {services.map(s => (
                    <option key={s._id} value={s.name}>{s.name}</option>
                  ))}
                </select>
                {services.length === 0 && (
                   <p className="text-[9px] text-red-500 font-bold mt-1 ml-1 uppercase">* Please add services in Admin first</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Upload Doctor Photo</label>
                <div className="relative group">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setDocData({...docData, image: e.target.files[0]})} 
                    className="hidden" 
                    id="docImage"
                  />
                  <label htmlFor="docImage" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-dashed border-2 border-slate-200 hover:border-primary flex items-center justify-center gap-3 cursor-pointer transition-all">
                    <Upload size={18} className="text-slate-400" />
                    <span className="text-sm font-bold text-slate-500">
                      {docData.image ? docData.image.name : "Choose Photo from PC"}
                    </span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Experience</label>
                  <input type="text" placeholder="5+ Years" required className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-primary outline-none font-bold" value={docData.experience} onChange={(e) => setDocData({...docData, experience: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Password</label>
                  <input type="password" placeholder="••••••••" required className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-primary outline-none font-bold" value={docData.password} onChange={(e) => setDocData({...docData, password: e.target.value})} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Work Email</label>
                <input type="email" placeholder="doctor@medicare.com" required className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-primary outline-none font-bold" value={docData.email} onChange={(e) => setDocData({...docData, email: e.target.value})} />
              </div>
              
              <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-black transition-all shadow-xl mt-4 flex items-center justify-center gap-2">
                COMPLETE ONBOARDING <ChevronRight size={20} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDoctors;