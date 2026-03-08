import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  CalendarCheck, User, Clock, Phone, Loader2,
  CheckCircle, XCircle, TrendingUp, Users,
  Search, Filter, Bell, LogOut, LayoutDashboard
} from "lucide-react";

const DoctorDashboard = () => {
  const doctor = JSON.parse(localStorage.getItem("doctor_info")) || JSON.parse(localStorage.getItem("medicare_user"));
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMessageModal, setShowMessageModal] = useState(false); // ✅ Added modal state
  const [adminMessage, setAdminMessage] = useState(""); // ✅ Added message state

  useEffect(() => {
    const fetchMyAppointments = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/auth/doctor-appointments/${doctor?.id || doctor?._id}`);
        setAppointments(res.data);
      } catch (err) {
        console.error("Error fetching appointments:", err);
      } finally {
        setLoading(false);
      }
    };
    if (doctor?.id || doctor?._id) fetchMyAppointments();
  }, [doctor?.id, doctor?._id]);

  const handleUpdateStatus = async (id, status) => {
    const messagePrompt = status === 'Confirmed'
      ? 'Any message for the patient? (Optional)'
      : 'Reason for rejection? (Optional)';

    const doctorMessage = window.prompt(messagePrompt) || "";

    try {
      await axios.put(`http://localhost:5000/api/doctor/update-appointment-status/${id}`, {
        status,
        doctorMessage
      });
      setAppointments(prev => prev.map(app =>
        app._id === id ? { ...app, status, doctorMessage } : app
      ));
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  // ✅ Send Message to Admin Logic
  const handleSendMessage = async () => {
    if (!adminMessage.trim()) return;
    try {
      await axios.post("http://localhost:5000/api/auth/message-admin", {
        doctorId: doctor?.id || doctor?._id,
        doctorName: doctor?.name,
        message: adminMessage
      });
      alert("Message Sent to Admin!");
      setAdminMessage("");
      setShowMessageModal(false);
    } catch (err) {
      alert("Failed to send message.");
    }
  };

  const stats = [
    { label: "Total Bookings", value: appointments.length, icon: CalendarCheck, color: "bg-indigo-500" },
    { label: "Pending Review", value: appointments.filter(a => a.status === 'Pending').length, icon: Clock, color: "bg-amber-500" },
    { label: "Today's Patient", value: appointments.filter(a => a.status === 'Confirmed').length, icon: Users, color: "bg-emerald-500" },
  ];

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-indigo-600" size={50} /></div>;

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-left">

      {/* 🚀 LEFT SIDEBAR (Doctor Info) */}
      <div className="hidden lg:flex flex-col w-72 bg-slate-900 p-8 text-white fixed h-full">
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-indigo-600 p-2 rounded-xl"><LayoutDashboard size={24} /></div>
          <span className="text-xl font-black italic tracking-tighter">Doctor<span className="text-indigo-400">Panel</span></span>
        </div>

        <div className="flex flex-col items-center mb-12 p-6 bg-slate-800/50 rounded-[2.5rem] border border-slate-700">
          <div className="w-20 h-20 bg-indigo-500 rounded-full flex items-center justify-center text-3xl font-black mb-4 shadow-xl">
            {doctor?.name?.charAt(0)}
          </div>
          <h2 className="text-lg font-black text-white">Dr. {doctor?.name}</h2>
          <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mt-1">Verified Surgeon</p>
        </div>

        <nav className="flex-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-6 py-4 bg-indigo-600 rounded-2xl font-bold text-sm"> <TrendingUp size={18} /> Overview </button>
          <button onClick={() => setShowMessageModal(true)} className="w-full flex items-center gap-3 px-6 py-4 hover:bg-slate-800 rounded-2xl font-bold text-sm text-slate-400 transition-all"> <Bell size={18} /> Message Admin </button>
        </nav>

        <button onClick={() => { localStorage.clear(); window.location.href = "/doctor/login" }} className="flex items-center gap-3 px-6 py-4 text-red-400 font-bold text-sm hover:bg-red-500/10 rounded-2xl transition-all mt-auto">
          <LogOut size={18} /> Logout
        </button>
      </div>

      {/* 🚀 MAIN CONTENT */}
      <div className="flex-1 lg:ml-72 p-6 lg:p-12">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 italic tracking-tight mb-2">My <span className="text-indigo-600">Dashboard</span></h1>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Efficiency starts here, Doctor.</p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text" placeholder="Search patient name..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-slate-200 shadow-sm focus:ring-2 focus:ring-indigo-600 outline-none font-bold text-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {stats.map((s, i) => (
            <div key={i} className="bg-white p-8 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-white flex justify-between items-end group hover:-translate-y-1 transition-all">
              <div>
                <s.icon className="text-indigo-600 mb-4" size={32} />
                <h3 className="text-4xl font-black text-slate-900 tracking-tight">{s.value}</h3>
                <p className="text-slate-400 font-black uppercase text-[10px] mt-2 tracking-widest">{s.label}</p>
              </div>
              <div className={`${s.color} h-2 w-16 rounded-full mb-1 opacity-20 group-hover:opacity-100 transition-all`}></div>
            </div>
          ))}
        </div>

        {/* PATIENT LIST */}
        <div className="bg-white rounded-[3.5rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black text-slate-900 italic">Upcoming <span className="text-indigo-600">Consultations</span></h3>
            <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-all">
              <Filter size={20} />
            </button>
          </div>

          <div className="space-y-4">
            {appointments.length > 0 ? appointments.filter(a => a.patientName.toLowerCase().includes(searchTerm.toLowerCase())).map((app) => (
              <div key={app._id} className="group bg-slate-50/50 p-6 rounded-[2.5rem] border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8 hover:bg-white hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-6 w-full">
                  <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-xl font-black text-indigo-600 shadow-sm border border-indigo-50 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    {app.patientName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-xl font-black text-slate-800 tracking-tight">{app.patientName}</p>
                    <div className="flex flex-wrap gap-4 mt-2">
                      <span className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <Clock size={12} className="text-indigo-500" /> {app.date} | {app.time}
                      </span>
                      <span className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <Phone size={12} className="text-indigo-500" /> {app.phone}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto border-t md:border-none pt-4 md:pt-0 justify-end">
                  {app.status === 'Pending' ? (
                    <div className="flex gap-2">
                      <button onClick={() => handleUpdateStatus(app._id, 'Confirmed')} className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                        <CheckCircle size={16} /> Accept
                      </button>
                      <button onClick={() => handleUpdateStatus(app._id, 'Rejected')} className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-all">
                        <XCircle size={16} /> Reject
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-end">
                      <span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${app.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                        {app.status}
                      </span>
                      {app.doctorMessage && <p className="text-[9px] font-bold text-slate-400 mt-2 italic max-w-[150px] text-right truncate">Note: {app.doctorMessage}</p>}
                    </div>
                  )}
                </div>
              </div>
            )) : (
              <div className="py-20 text-center bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200">
                <Users size={48} className="mx-auto text-slate-200 mb-4" />
                <p className="text-slate-400 font-bold italic">No appointments found.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Message Admin Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-black text-slate-900 mb-4 italic">Message <span className="text-indigo-600">Admin</span></h3>
            <textarea
              className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none resize-none mb-6"
              rows={4}
              placeholder="Write your message or issue here..."
              value={adminMessage}
              onChange={(e) => setAdminMessage(e.target.value)}
            />
            <div className="flex gap-4 justify-end">
              <button onClick={() => setShowMessageModal(false)} className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-all">Cancel</button>
              <button onClick={handleSendMessage} className="px-6 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">Send Message</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DoctorDashboard; 