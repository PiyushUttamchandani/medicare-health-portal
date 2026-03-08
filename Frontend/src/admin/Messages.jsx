import React, { useState, useEffect } from "react";
import axios from "axios";
import { Mail, Trash2, Clock, CheckCircle, Send, Users, Stethoscope, Loader2 } from "lucide-react";

const Messages = () => {
  const [activeTab, setActiveTab] = useState("patients");
  const [liveMessages, setLiveMessages] = useState([]); // Used for Doctors
  const [patientMessages, setPatientMessages] = useState([]); // Used for Patients
  const [loading, setLoading] = useState(true);

  // FETCH MESSAGES
  const fetchMessages = async () => {
    try {
      setLoading(true);
      // Fetch both endpoints concurrently
      const [doctorRes, patientRes] = await Promise.all([
        axios.get("http://localhost:5000/api/auth/all-messages").catch(() => ({ data: [] })),
        axios.get("http://localhost:5000/api/auth/all-contact-messages").catch(() => ({ data: [] }))
      ]);

      setLiveMessages(Array.isArray(doctorRes?.data) ? doctorRes.data : []);
      setPatientMessages(Array.isArray(patientRes?.data) ? patientRes.data : []);
    } catch (err) {
      console.error("Failed to fetch messages", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // DISMISS MESSAGE
  const handleDismiss = async (id, isPatient) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to dismiss this message?");
      if (!confirmDelete) return;

      const endpoint = isPatient
        ? `http://localhost:5000/api/auth/delete-contact-message/${id}`
        : `http://localhost:5000/api/auth/delete-message/${id}`;

      await axios.delete(endpoint);
      // Refresh the list after deleting
      fetchMessages();
    } catch (err) {
      console.error("Failed to dismiss message", err);
      alert("Error deleting message. Please try again.");
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Hospital Communications</h1>

        {/* TABS SWITCHER */}
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTab("patients")}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'patients' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Users size={16} /> Patients
          </button>
          <button
            onClick={() => setActiveTab("doctors")}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'doctors' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Stethoscope size={16} /> Doctors
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20"><Loader2 className="animate-spin text-primary" size={40} /></div>
      ) : (
        <div className="grid gap-6">
          {(activeTab === "patients" ? patientMessages : liveMessages).map((m) => (
            <div key={m._id || m.id} className={`bg-white p-6 rounded-[2rem] border transition-all hover:shadow-md ${m.urgent ? 'border-red-100 shadow-sm shadow-red-50' : 'border-slate-100 shadow-sm'}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${activeTab === 'patients' ? 'bg-blue-50 text-blue-500' : 'bg-emerald-50 text-emerald-500'}`}>
                    {activeTab === 'patients' ? <Mail size={24} /> : <Stethoscope size={24} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                      {m.senderName ? `Dr. ${m.senderName}` : m.sender}
                      {m.urgent && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-md animate-pulse">URGENT</span>}
                    </h3>
                    <p className="text-sm text-slate-400 font-medium">
                      {activeTab === 'patients' ? m.email : 'Doctor query'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Clock size={14} /> {m.createdAt ? new Date(m.createdAt).toLocaleDateString() : m.time}
                </div>
              </div>


              <p className="text-slate-600 bg-slate-50 p-4 rounded-xl italic border border-slate-100">
                "{m.msg || m.message}"
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => alert("Reply feature coming soon!")}
                  className="px-5 py-2.5 text-xs font-bold text-primary bg-primary/5 rounded-xl hover:bg-primary/10 transition-all flex items-center gap-2"
                >
                  <Send size={14} /> Reply
                </button>
                <button
                  onClick={() => handleDismiss(m._id || m.id, activeTab === "patients")}
                  className="px-5 py-2.5 text-xs font-bold text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-all flex items-center gap-2"
                >
                  <Trash2 size={14} /> Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Messages;