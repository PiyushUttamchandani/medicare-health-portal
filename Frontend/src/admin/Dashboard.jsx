import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Users,
  Stethoscope,
  Activity,
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle2,
  Loader2
} from "lucide-react";

const Dashboard = () => {
  const [counts, setCounts] = useState({
    users: 0,
    doctors: 0,
    messages: 0
  });
  const [recentMessages, setRecentMessages] = useState([]); // ✅ Added state for messages
  const [loading, setLoading] = useState(true);

  // ✅ 1. Database se real counts fetch karein (Improved Logic)
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);

        // individual try-catch use kiya taaki ek fail ho toh baaki chalein
        const fetchUsers = axios.get("http://localhost:5000/api/auth/all-users").catch(() => ({ data: [] }));
        const fetchDocs = axios.get("http://localhost:5000/api/auth/all-doctors").catch(() => ({ data: [] }));
        const fetchMsgs = axios.get("http://localhost:5000/api/auth/all-messages").catch(() => ({ data: [] }));

        const [usersRes, docsRes, msgsRes] = await Promise.all([fetchUsers, fetchDocs, fetchMsgs]);

        // ✅ Correctly handle the messages array even if data is returned empty or undefined
        const msgs = Array.isArray(msgsRes?.data) ? msgsRes.data : [];
        console.log("API Msg Response:", msgsRes?.data);
        console.log("Processed msgs array:", msgs);

        setCounts({
          users: Array.isArray(usersRes?.data) ? usersRes.data.length : 0,
          doctors: Array.isArray(docsRes?.data) ? docsRes.data.length : 0,
          messages: msgs.length
        });

        setRecentMessages(msgs.slice(0, 5)); // ✅ Show only top 5 recent messages
      } catch (err) {
        console.error("Dashboard Stats Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  const adminStats = [
    { title: "Total Registered Users", value: counts.users, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Active Doctors", value: counts.doctors, icon: Stethoscope, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Today's Revenue", value: "₹84,200", icon: Activity, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Pending Queries", value: counts.messages, icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  if (loading) return <div className="py-40 flex justify-center"><Loader2 className="animate-spin text-primary" size={40} /></div>;

  return (
    <div className="animate-in fade-in duration-700 p-6">
      <div className="mb-10 text-left">
        <h1 className="text-3xl font-black text-slate-900 italic tracking-tight">Hospital <span className="text-primary">Administration</span></h1>
        <p className="text-slate-500 mt-1 font-medium italic">Real-time management overview and system performance.</p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 text-left">
        {adminStats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300">
            <div className={`${stat.bg} ${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6`}>
              <stat.icon size={28} />
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{stat.title}</p>
            <h3 className="text-3xl font-black text-slate-900 mt-2 tracking-tighter">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8 text-left">
        <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/40">
          <h3 className="text-xl font-black text-slate-900 mb-8 italic">System <span className="text-primary">Logs</span></h3>
          <div className="space-y-8">
            <div className="flex gap-5 items-start">
              <div className="bg-emerald-100 text-emerald-600 p-3 rounded-2xl"><CheckCircle2 size={20} /></div>
              <div>
                <p className="text-sm font-black text-slate-800 tracking-tight">Real-time Data Sync</p>
                <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-widest">Connected to MongoDB Database</p>
              </div>
            </div>
            <div className="flex gap-5 items-start">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-2xl"><Clock size={20} /></div>
              <div>
                <p className="text-sm font-black text-slate-800 tracking-tight">Active Session</p>
                <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-widest">Monitoring {counts.users + counts.doctors} registered profiles</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-[3rem] p-10 text-white flex flex-col justify-center items-center text-center shadow-2xl shadow-primary/20 relative overflow-hidden group">
          <TrendingUp size={60} className="mb-6 text-primary animate-bounce" />
          <h3 className="text-2xl font-black italic tracking-tight">Monthly Growth: +15%</h3>
          <p className="text-slate-400 mt-4 text-sm font-medium max-w-xs">
            Patient registrations are showing a steady increase since February 2026.
          </p>
        </div>
      </div>

      {/* ✅ RECENT MESSAGES FROM DOCTORS */}
      <div className="mt-10 bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/40 text-left animate-in slide-in-from-bottom duration-700">
        <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3 italic">
          <AlertCircle className="text-amber-500" size={28} /> Recent <span className="text-primary">Doctor Queries</span>
        </h3>

        {recentMessages.length > 0 ? (
          <div className="space-y-4">
            {recentMessages.map((msg) => (
              <div key={msg._id} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex gap-4 items-start">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-black text-lg shrink-0">
                  {msg.senderName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-black text-slate-800">Dr. {msg.senderName}</h4>
                    <span className="text-[10px] bg-white border border-slate-200 px-2 py-1 rounded-full text-slate-400 font-bold uppercase tracking-widest">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-600 font-medium leading-relaxed bg-white p-4 rounded-2xl border border-slate-100 mt-2 shadow-sm">
                    "{msg.message}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
            <CheckCircle2 size={40} className="mx-auto text-emerald-400 mb-3" />
            <p className="text-slate-500 font-bold">All caught up! No messages from doctors.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard; 