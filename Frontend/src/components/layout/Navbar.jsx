import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  Menu,
  X,
  Stethoscope,
  CalendarPlus,
  PhoneCall,
  UserCircle,
  LogOut,
  Activity, // ✅ Yahan error tha, import nahi kiya tha
} from "lucide-react";
import { useAuth } from "../../utils/Auth";

const Navbar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  const linkStyle = (path) =>
    `transition-colors duration-200 font-medium flex items-center gap-2 ${
      location.pathname === path
        ? "text-primary"
        : "text-slate-600 hover:text-primary"
    }`;

  return (
    <>
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 z-[9999]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center h-20">

          {/* LOGO */}
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 group"
          >
            <div className="bg-primary p-1.5 rounded-lg group-hover:rotate-12 transition-transform shadow-lg shadow-primary/20">
              <Stethoscope className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900 italic">
              Medi<span className="text-primary">Care</span>
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex gap-8 text-[15px] items-center">
            <Link to="/" className={linkStyle("/")}>Home</Link>
            <Link to="/services" className={linkStyle("/services")}>Services</Link>
            <Link to="/doctors" className={linkStyle("/doctors")}>Doctors</Link>
            
            <Link 
              to="/appointment" 
              state={null} 
              className={linkStyle("/appointment")}
            >
              <CalendarPlus size={18} />
              Book Appointment
            </Link>

            <div className="h-4 w-[1px] bg-slate-200 mx-2" />

            <Link
              to="/contact"
              className={linkStyle("/contact")}
            >
              <PhoneCall size={18} />
              Support
            </Link>

            {/* ✅ History Link Fixed */}
            <Link to="/appointment-history" className={linkStyle("/appointment-history")}>
              <Activity size={18} /> History
            </Link>

            {/* User Info & Logout */}
            {user ? (
              <div className="flex items-center gap-4 ml-2 border-l pl-4 border-slate-200">
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Patient</span>
                    <span className="text-sm font-bold text-slate-900 italic">Hi, {user.name.split(" ")[0]}</span>
                </div>
                
                <Link to="/profile" className={linkStyle("/profile")}>
                  <div className={`p-2 rounded-xl transition-all ${location.pathname === '/profile' ? 'bg-primary/10 border-primary/20' : 'bg-slate-100 border-transparent'} border-2`}>
                    <UserCircle size={22} className={location.pathname === '/profile' ? 'text-primary' : 'text-slate-400'} />
                  </div>
                </Link>

                <button 
                  onClick={logout}
                  className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold shadow-md shadow-primary/20 hover:bg-primaryDark transition-all active:scale-95"
              >
                Sign In
              </Link>
            )}
          </nav>

          {/* MOBILE TOGGLE */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors z-[10000]"
          >
            {open ? <X className="text-slate-900" size={28} /> : <Menu className="text-slate-900" size={28} />}
          </button>
        </div>
      </header>

      {/* MOBILE MENU */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-[9998]"
          onClick={() => setOpen(false)}
        >
          <div
            className="absolute top-0 right-0 w-72 h-full bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="flex flex-col gap-6 text-lg font-semibold mt-16 text-left">
              <Link onClick={() => setOpen(false)} to="/" className={linkStyle("/")}>Home</Link>
              <Link onClick={() => setOpen(false)} to="/services" className={linkStyle("/services")}>Services</Link>
              <Link onClick={() => setOpen(false)} to="/doctors" className={linkStyle("/doctors")}>Doctors</Link>
              <Link onClick={() => setOpen(false)} to="/appointment" state={null} className={linkStyle("/appointment")}>
                <CalendarPlus size={20} /> Book Appointment
              </Link>
              {/* ✅ History in Mobile Menu */}
              <Link onClick={() => setOpen(false)} to="/appointment-history" className={linkStyle("/appointment-history")}>
                <Activity size={20} /> History
              </Link>
              <Link onClick={() => setOpen(false)} to="/profile" className={linkStyle("/profile")}>
                <UserCircle size={22} /> My Profile
              </Link>

              <div className="border-t pt-4 mt-2" />

              <Link onClick={() => setOpen(false)} to="/contact" className={linkStyle("/contact")}>
                <PhoneCall size={18} /> Support
              </Link>

              {user ? (
                <button 
                  onClick={() => { logout(); setOpen(false); }}
                  className="flex items-center gap-3 text-red-500 bg-red-50 p-4 rounded-2xl font-black w-full shadow-sm text-left"
                >
                  <LogOut size={20} /> Logout Account
                </button>
              ) : (
                <Link
                  onClick={() => setOpen(false)}
                  to="/auth"
                  className="bg-primary text-white py-3 rounded-xl shadow-md text-center"
                >
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;