import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Users, 
  MessageSquare, 
  LogOut,
  Bell,
  Search,
  Activity,
  Stethoscope
} from "lucide-react";

const AdminLayout = ({ children }) => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Messages", path: "/admin/messages", icon: MessageSquare },
    { name: "User Management", path: "/admin/users", icon: Users},
    { name: "Add Doctor", path: "/admin/add-doctor", icon: CalendarCheck },
    { name: "Services", path: "/admin/services", icon: Stethoscope },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* SIDEBAR - Fixed Width & Full Height */}
      <aside className="w-72 bg-[#1E293B] text-white fixed h-full z-50 transition-all duration-300 shadow-2xl">
        <div className="p-8 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/30">
              <Activity size={24} className="text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight italic">
              Medi<span className="text-primary">Care</span>
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-3 ml-1">Admin Portal</p>
        </div>

        <nav className="p-6 space-y-3 mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all duration-300 group ${
                  isActive 
                  ? "bg-primary text-white shadow-xl shadow-primary/40 translate-x-2" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon size={22} className={`${isActive ? "text-white" : "group-hover:text-primary transition-colors"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-6 border-t border-slate-700/50 bg-[#1E293B]">
          <button className="flex items-center gap-4 px-5 py-4 w-full text-slate-400 font-bold hover:bg-red-500/10 hover:text-red-500 rounded-2xl transition-all group">
            <LogOut size={22} className="group-hover:rotate-180 transition-transform duration-500" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 ml-72">
        {/* ADMIN TOP HEADER - Custom for Admin only */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-40">
          <div className="relative w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search patients, doctors..." 
              className="w-full pl-12 pr-4 py-2.5 bg-slate-100/50 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-all">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200"></div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900 leading-none">Admin User</p>
                <p className="text-[10px] text-slate-400 font-bold mt-1">Super Admin</p>
              </div>
              <img 
                src="https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff" 
                className="w-10 h-10 rounded-xl border-2 border-slate-100" 
                alt="Profile" 
              />
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="p-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;