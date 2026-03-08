import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Stethoscope, Lock, Mail, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "../utils/Auth"; // ✅ Auth Context import kiya

const DoctorLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ Context se login function nikala

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // ✅ 1. Backend API Call
      const res = await axios.post("http://localhost:5000/api/auth/doctor-login", { email, password });
      
      // ✅ 2. Auth Context Update (Sabse Zaroori)
      // Isse ProtectedRoute ko pata chalega ki 'doctor' login ho gaya hai
      login(res.data.doctor); 

      // ✅ 3. Success Feedback & Redirect
      alert(`Welcome Back Dr. ${res.data.doctor.name}`);
      navigate("/doctor/dashboard"); 
      
    } catch (err) {
      alert(err.response?.data?.msg || "Doctor Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
      <div className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100 animate-in zoom-in duration-500">
        <div className="text-center mb-10">
          <div className="bg-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-200">
            <Stethoscope className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 italic tracking-tight">
            Doctor <span className="text-indigo-600">Portal</span>
          </h2>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-2">
            Professional Access Only
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-wider">Work Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="email" 
                required 
                placeholder="doctor@hospital.com"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none font-bold placeholder:text-slate-300" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-wider">Secret Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="password" 
                required 
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none font-bold placeholder:text-slate-300" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-100 disabled:bg-indigo-300 active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : (
              <>LOGIN TO SYSTEM <ArrowRight size={20} /></>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
          Secure End-to-End Encryption Enabled
        </p>
      </div>
    </div>
  );
};

export default DoctorLogin;