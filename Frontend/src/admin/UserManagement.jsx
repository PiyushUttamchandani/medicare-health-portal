import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, ShieldAlert, ShieldCheck, UserPlus, X, Users, Search } from "lucide-react";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "" });

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
  try {
    // ✅ Pura URL likhna zaroori hai agar proxy setup nahi hai
    const res = await axios.get("http://localhost:5000/api/auth/all-users");
    setUsers(res.data);
  } catch (err) {
    console.error("API Error:", err);
  }
};

  const handleAddUser = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/auth/admin-add-user", newUser);
    setShowModal(false);
    setNewUser({ name: "", email: "", password: "" });
    fetchUsers();
  };

  const deleteUser = async (id) => {
    if (window.confirm("Delete this user permanently?")) {
      await axios.delete(`http://localhost:5000/api/auth/delete-user/${id}`);
      fetchUsers();
    }
  };

  const toggleBlock = async (id) => {
    await axios.put(`http://localhost:5000/api/auth/toggle-block/${id}`);
    fetchUsers();
  };

  return (
    <div className="p-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Users className="text-primary" size={32} /> User Management
          </h1>
          <p className="text-slate-400 font-medium">Manage patient access and account status</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-primaryDark transition-all shadow-lg shadow-primary/20"
        >
          <UserPlus size={20} /> Add New User
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="relative mb-8 max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" placeholder="Search by name or email..." 
          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-slate-100 shadow-sm outline-none focus:ring-2 focus:ring-primary/20"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* USERS TABLE */}
      <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="p-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">User Details</th>
              <th className="p-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Email</th>
              <th className="p-6 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
              <th className="p-6 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase())).map((u) => (
              <tr key={u._id} className="hover:bg-slate-50/30 transition-colors group">
                <td className="p-6">
                  <div className="font-bold text-slate-800">{u.name}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-black">UID: {u._id.slice(-6)}</div>
                </td>
                <td className="p-6 text-slate-500 font-medium">{u.email}</td>
                <td className="p-6 text-center">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${u.isBlocked ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                    {u.isBlocked ? "Blocked" : "Active"}
                  </span>
                </td>
                <td className="p-6 flex justify-center gap-4">
                  <button onClick={() => toggleBlock(u._id)} className={`p-2.5 rounded-xl transition-all ${u.isBlocked ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600 hover:bg-orange-100'}`} title="Block/Unblock">
                    {u.isBlocked ? <ShieldCheck size={20} /> : <ShieldAlert size={20} />}
                  </button>
                  <button onClick={() => deleteUser(u._id)} className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all">
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADD USER MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl relative animate-in zoom-in duration-300">
            <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900">
              <X size={24} />
            </button>
            <h3 className="text-2xl font-black text-slate-900 mb-8 italic">New User Registration</h3>
            <form onSubmit={handleAddUser} className="space-y-5">
              <input type="text" placeholder="Full Name" required className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-primary outline-none font-bold" value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})} />
              <input type="email" placeholder="Email Address" required className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-primary outline-none font-bold" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} />
              <input type="password" placeholder="Temporary Password" required className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-primary outline-none font-bold" value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} />
              <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-black transition-all shadow-xl shadow-slate-200">
                CREATE ACCOUNT
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;