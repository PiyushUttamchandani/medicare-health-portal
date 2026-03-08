import React, { useState, useEffect } from "react";
import {
  User, HeartPulse, Droplet, Save, MapPin,
  Calendar, ChevronDown, Activity,
  Thermometer, ShieldAlert, Pill, CheckCircle2, ShieldX, LogOut, Loader2
} from "lucide-react";
import { useAuth } from "../utils/Auth";
import axios from "axios";

const ModernInput = ({ icon: Icon, label, helperText, ...props }) => (
  <div className="space-y-1.5 flex-1 text-left">
    <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">
      {label}
    </label>
    <div className="relative group">
      {Icon && (
        <Icon
          className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors"
          size={18}
        />
      )}
      <input
        {...props}
        className={`w-full ${Icon ? "pl-11" : "px-5"} pr-4 py-4 rounded-2xl
        bg-slate-50 border border-slate-100 font-bold
        focus:border-primary focus:ring-4 focus:ring-primary/10
        hover:border-slate-200 transition-all
        text-slate-700 placeholder:text-slate-300 outline-none`}
      />
    </div>
    {helperText && <p className="text-[10px] font-bold text-primary ml-1 italic">{helperText}</p>}
  </div>
);

const Profile = () => {
  const { user, login, logout } = useAuth();
  const [isUpdated, setIsUpdated] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    age: "", gender: "", weight: "", height: "",
    location: "", bloodGroup: "",
    allergies: "", medications: "",
  });

  const [submittedData, setSubmittedData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);

  const getInches = (cm) => {
    if (!cm || isNaN(cm)) return "";
    const totalInches = (cm / 2.54).toFixed(1);
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet}'${inches}"`;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/auth/all-users`);
        const cloudUser = res.data.find(u => u._id === user?.id || u._id === user?._id);
        if (cloudUser) {
          setProfile(prev => ({ ...prev, ...cloudUser }));
          setSubmittedData(cloudUser);
          setShowSummary(true);
        }
      } catch (err) { console.error("Sync Error"); }
    };
    fetchProfile();

    // ✅ Fetch Appointments for this patient
    const fetchAppointments = async () => {
      if (!user?.id && !user?._id) return;
      try {
        setLoadingAppointments(true);
        const patientId = user.id || user._id;
        const res = await axios.get(`http://localhost:5000/api/auth/patient-appointments/${patientId}`);
        setAppointments(res.data);
      } catch (err) {
        console.error("Error fetching patient appointments:", err);
      } finally {
        setLoadingAppointments(false);
      }
    };
    fetchAppointments();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    setIsUpdated(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // ✅ 1. Save to MongoDB
      const res = await axios.put(`http://localhost:5000/api/auth/update-profile/${user.id || user._id}`, profile);

      // ✅ 2. Sync UI states with response data
      login(res.data.user);
      setProfile(res.data.user);
      setSubmittedData(res.data.user);

      setIsUpdated(true);
      setShowSummary(true);
      alert("Profile Saved!");
    } catch (err) {
      alert("Sync Failed: Check if backend is running");
    } finally { setSubmitting(false); }
  };

  if (user?.isBlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md w-full bg-white p-12 rounded-[3.5rem] shadow-2xl text-center">
          <ShieldX size={64} className="text-red-500 mx-auto mb-6" />
          <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter italic text-left">Access Restricted</h2>
          <p className="text-slate-500 font-bold mb-10 text-left">Your clinical access has been revoked by the administrator.</p>
          <button onClick={logout} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-2">
            <LogOut size={20} /> LOGOUT
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24 text-left">
      <div className="absolute top-0 left-0 w-full h-80 bg-[#0f172a] z-0" />

      <div className="max-w-6xl mx-auto pt-28 px-6 relative z-10">
        <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-10 mb-16">

          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white/90 backdrop-blur-xl rounded-[3rem] p-10 shadow-2xl border border-white text-center">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <User size={44} className="text-primary" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 italic tracking-tight">{profile.name}</h2>
              <p className="text-[10px] mt-2 uppercase tracking-widest font-black text-primary px-4 py-1.5 bg-primary/5 rounded-full inline-block">Secure Patient Profile</p>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 space-y-6">
              <div className="flex gap-4">
                <ModernInput label="Weight (kg)" name="weight" type="number" value={profile.weight} onChange={handleChange} />
                <ModernInput label="Height (cm)" name="height" type="number" helperText={getInches(profile.height)} value={profile.height} onChange={handleChange} />
              </div>
              <ModernInput icon={Calendar} label="Age" name="age" type="number" value={profile.age} onChange={handleChange} />
              <ModernInput icon={MapPin} label="Location" name="location" value={profile.location} onChange={handleChange} />
            </div>
          </div>

          <div className="lg:col-span-8 bg-white rounded-[3rem] p-12 shadow-2xl border border-slate-100">
            <h3 className="text-2xl font-black text-slate-950 mb-10 flex items-center gap-4 italic border-b pb-8">
              <HeartPulse className="text-primary" size={28} /> Clinical <span className="text-primary">Snapshot</span>
            </h3>

            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Blood Group</label>
                <div className="relative">
                  <Droplet className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500" size={20} />
                  <select name="bloodGroup" value={profile.bloodGroup} onChange={handleChange} className="w-full pl-12 pr-10 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold outline-primary appearance-none cursor-pointer">
                    <option value="">Select Group</option>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(b => <option key={b}>{b}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Gender</label>
                <div className="relative">
                  <Thermometer className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={20} />
                  <select name="gender" value={profile.gender} onChange={handleChange} className="w-full pl-12 pr-10 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold outline-primary appearance-none cursor-pointer">
                    <option value="">Select Gender</option>
                    {["Male", "Female", "Other"].map(g => <option key={g}>{g}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                </div>
              </div>

              <div className="md:col-span-2">
                <ModernInput icon={ShieldAlert} label="Allergies" name="allergies" value={profile.allergies} onChange={handleChange} />
              </div>
              <div className="md:col-span-2">
                <ModernInput icon={Pill} label="Medications" name="medications" value={profile.medications} onChange={handleChange} />
              </div>
            </div>

            <button type="submit" disabled={submitting} className="mt-12 bg-slate-900 text-white w-full py-5 rounded-2xl font-black text-xl hover:bg-primary transition-all flex items-center justify-center gap-4 shadow-2xl active:scale-[0.98]">
              {submitting ? <Loader2 className="animate-spin" /> : <><Save size={24} /> UPDATE CLINICAL RECORD</>}
            </button>
            {isUpdated && <p className="text-center mt-4 text-green-600 font-black text-xs uppercase tracking-[0.2em] animate-pulse">Data Synced with Database</p>}
          </div>
        </form>

        {/* ✅ FIXED: Summary Table Logic */}
        {showSummary && submittedData && (
          <div className="bg-white rounded-[3.5rem] p-12 shadow-2xl border border-slate-100 animate-in slide-in-from-bottom duration-700">
            <h3 className="text-2xl font-black text-slate-950 flex items-center gap-4 italic border-b pb-8 mb-10">
              <Activity className="text-primary" size={28} /> Health Summary <span className="text-slate-300 font-normal italic">Stored Data</span>
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(submittedData)
                .filter(([key]) => !["_id", "__v", "password", "isBlocked", "role", "id", "email", "createdAt", "updatedAt"].includes(key))
                .map(([key, value]) => (
                  <div key={key} className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 hover:bg-white transition-all group">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-primary transition-colors">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </p>
                    <p className="text-lg font-black text-slate-800 tracking-tight italic capitalize">
                      {value && value !== "" ? (key === 'height' ? `${value} cm` : (key === 'weight' ? `${value} kg` : value)) : "Not Set"}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}



      </div>
    </div>
  );
};

export default Profile;