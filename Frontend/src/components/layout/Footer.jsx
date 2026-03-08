import React from "react";
import { Link } from "react-router-dom";
import { 
  Stethoscope, 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  ArrowUpRight
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-400 pt-20 pb-10 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* COLUMN 1: BRANDING */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
                <Stethoscope className="text-white" size={24} />
              </div>
              <span className="text-2xl font-black text-white italic tracking-tight">
                Medi<span className="text-primary">Care</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed font-medium italic">
              Providing world-class healthcare solutions with a touch of technology. Your health is our priority.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                <a key={index} href="#" className="p-2.5 bg-slate-900 rounded-xl hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* COLUMN 2: QUICK LINKS */}
          <div className="space-y-6">
            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em]">Navigation</h4>
            <ul className="space-y-4">
              {['Home', 'Services', 'Doctors', 'Appointment'].map((item) => (
                <li key={item}>
                  <Link 
                    to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`} 
                    className="hover:text-primary transition-colors flex items-center gap-1 group text-sm font-bold"
                  >
                    {item} <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: SERVICES */}
          <div className="space-y-6">
            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em]">Our Specialities</h4>
            <ul className="space-y-4">
              {['Cardiology', 'Neurology', 'Pediatrics', 'Diagnostics'].map((service) => (
                <li key={service} className="text-sm font-bold hover:text-primary cursor-pointer transition-colors">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 4: CONTACT INFO */}
          <div className="space-y-6">
            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em]">Get In Touch</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="text-primary mt-1" size={18} />
                <p className="text-sm font-bold leading-snug">
                  123 Healthcare Blvd, <br /> Ahmedabad, Gujarat, India
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-primary" size={18} />
                <p className="text-sm font-bold">+91 98765 43210</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-primary" size={18} />
                <p className="text-sm font-bold">support@medicare.com</p>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-600">
            © {currentYear} MediCare. All Rights Reserved.
          </p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-600">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;