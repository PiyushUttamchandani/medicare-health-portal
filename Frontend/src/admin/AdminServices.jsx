import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Trash2, Stethoscope, Loader2, X, Briefcase } from "lucide-react";

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newService, setNewService] = useState({ name: "", description: "", iconName: "Stethoscope" });

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/auth/all-services");
      setServices(res.data);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchServices(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/admin-add-service", newService);
      setShowModal(false);
      setNewService({ name: "", description: "", iconName: "Stethoscope" });
      fetchServices();
    } catch (err) { alert("Error adding service"); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this service? Doctors linked to it might be affected.")) {
      await axios.delete(`http://localhost:5000/api/auth/delete-service/${id}`);
      fetchServices();
    }
  };

  return (
    <div className="p-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-black text-slate-900 italic">Hospital <span className="text-primary">Services</span></h1>
        <button onClick={() => setShowModal(true)} className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg active:scale-95 transition-all">
          <Plus size={20} /> ADD SERVICE
        </button>
      </div>

      {loading ? <Loader2 className="animate-spin text-primary mx-auto mt-20" size={40} /> : (
        <div className="grid md:grid-cols-3 gap-6">
          {services.map(s => (
            <div key={s._id} className="bg-white p-6 rounded-[2rem] shadow-xl border border-slate-50 relative group">
              <button onClick={() => handleDelete(s._id)} className="absolute top-4 right-4 text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:text-red-600">
                <Trash2 size={18} />
              </button>
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
                <Stethoscope size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-800">{s.name}</h3>
              <p className="text-slate-500 text-sm mt-2 font-medium">{s.description}</p>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl relative">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-slate-300 hover:text-slate-900"><X size={24} /></button>
            <h3 className="text-2xl font-black mb-6 italic">New <span className="text-primary">Department</span></h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <input type="text" placeholder="Service Name (e.g. Cardiology)" required className="w-full px-6 py-4 rounded-2xl bg-slate-50 outline-none ring-1 ring-slate-100 focus:ring-2 focus:ring-primary font-bold" value={newService.name} onChange={(e) => setNewService({...newService, name: e.target.value})} />
              <textarea placeholder="Brief Description" required className="w-full px-6 py-4 rounded-2xl bg-slate-50 outline-none ring-1 ring-slate-100 focus:ring-2 focus:ring-primary font-bold h-32" value={newService.description} onChange={(e) => setNewService({...newService, description: e.target.value})} />
              <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-black transition-all shadow-xl">CREATE SERVICE</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServices;