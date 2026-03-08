import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../utils/Auth"; //
import { Calendar, Clock, Activity, Loader2, FileText } from "lucide-react";

const AppointmentHistory = () => {
  const { user } = useAuth(); //
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      // ✅ Check karein ki user id available hai ya nahi
      const patientId = user?.id || user?._id; 
      
      if (!patientId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // ✅ Sahi Backend Endpoint se history fetch karein
        const res = await axios.get(`http://localhost:5000/api/auth/patient-appointments/${patientId}`);
        setAppointments(res.data);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  if (loading) return <div className="py-40 flex justify-center"><Loader2 className="animate-spin text-primary" size={40} /></div>;

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 text-left">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-4xl font-black text-slate-900 italic mb-10">
          My <span className="text-primary">Medical History</span>
        </h1>

        <div className="space-y-6">
          {appointments.length > 0 ? appointments.map((app) => (
            <div key={app._id} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-6">
                <div className="bg-primary/10 p-4 rounded-2xl text-primary"><Activity size={28} /></div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight italic">Dr. {app.doctorName}</h3>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{app.service}</p>
                  <div className="flex gap-4 mt-2">
                    <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1 uppercase tracking-tighter">
                      <Calendar size={12} className="mr-1 text-primary" /> {app.date}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1 uppercase tracking-tighter">
                      <Clock size={12} className="mr-1 text-primary" /> {app.time}
                    </span>
                  </div>
                </div>
              </div>

              {/* ✅ MERGED: Dynamic Status Styling (Red for Rejected) */}
              <span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                app.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-200' : 
                app.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 
                app.status === 'Rejected' || app.status === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-200' : 
                'bg-slate-50 text-slate-600 border-slate-200'
              }`}>
                {app.status}
              </span>
            </div>
          )) : (
            <div className="py-24 text-center bg-white rounded-[4rem] border-2 border-dashed border-slate-100">
              <FileText size={48} className="mx-auto text-slate-200 mb-4" />
              <p className="text-slate-400 font-bold italic">No records found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentHistory;