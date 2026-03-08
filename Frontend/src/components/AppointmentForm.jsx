import { User, Phone, Calendar, ClipboardList, ShieldCheck } from "lucide-react";

const AppointmentForm = () => {
  return (
    <section className="bg-white py-24">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            Book an Appointment
          </h2>
          <p className="text-slate-500 mt-3">
            Fill out the form below and our team will contact you within 2 hours.
          </p>
        </div>

        <form className="bg-slate-50 border border-slate-100 p-8 md:p-12 rounded-[2.5rem] shadow-sm space-y-6">
          
          {/* INPUT GROUP: NAME */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text"
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-primary transition-all outline-none bg-white" 
                placeholder="John Doe" 
              />
            </div>
          </div>

          {/* INPUT GROUP: PHONE */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="tel"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-primary transition-all outline-none bg-white" 
                  placeholder="+1 (555) 000-0000" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Preferred Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="date"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-primary transition-all outline-none bg-white text-slate-600" 
                />
              </div>
            </div>
          </div>

          {/* DEPARTMENT SELECT */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Department</label>
            <div className="relative">
              <ClipboardList className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <select className="w-full pl-12 pr-4 py-4 rounded-2xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-primary transition-all outline-none bg-white appearance-none text-slate-600">
                <option>Cardiology</option>
                <option>Neurology</option>
                <option>Pediatrics</option>
                <option>General Checkup</option>
              </select>
            </div>
          </div>

          <button className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg hover:bg-primaryDark hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-[0.98] mt-4">
            Confirm Appointment
          </button>

          {/* TRUST BADGE */}
          <div className="flex items-center justify-center gap-2 text-slate-400 text-sm mt-6">
            <ShieldCheck size={16} />
            <span>Your data is encrypted and secure</span>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AppointmentForm;