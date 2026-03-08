import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Stethoscope, User, Phone, Calendar, Clock, Loader2 } from "lucide-react";
import { useAuth } from "../utils/Auth";

const Appointment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // ✅ States for Database Data
  const [allServices, setAllServices] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // ✅ Form States
  const [serviceName, setServiceName] = useState("");
  const [doctor, setDoctor] = useState("");
  const [doctorId, setDoctorId] = useState(""); // ✅ Added doctorId state
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [phone, setPhone] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]); // ✅ Added bookedSlots state

  const today = new Date().toISOString().split("T")[0]; // ✅ Get today's date in YYYY-MM-DD


  // 1. Fetch Services and Doctors from Database
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [servicesRes, doctorsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/auth/all-services"),
          axios.get("http://localhost:5000/api/auth/all-doctors")
        ]);
        setAllServices(servicesRes.data);
        setAllDoctors(doctorsRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2. Auto-fill from Route State
  useEffect(() => {
    if (state?.service) setServiceName(state.service);
    if (state?.doctorName) setDoctor(state.doctorName);
    if (state?.doctorId) setDoctorId(state.doctorId); // ✅ Support doctorId from Route State
  }, [state]);

  // 3. 🚀 FILTER LOGIC: Jab Service change ho, toh sirf us speciality ke doctors dikhao
  useEffect(() => {
    if (serviceName) {
      // ✅ Specialization aur service name match hona chahiye
      const filtered = allDoctors.filter(doc => doc.specialization === serviceName);
      setFilteredDoctors(filtered);
    } else {
      setFilteredDoctors([]);
    }
  }, [serviceName, allDoctors]);

  // 4. ✅ AUTO-FIND DOCTOR ID: Agar `doctorName` state se aaya hai but `doctorId` nahi aaya
  useEffect(() => {
    if (doctor && !doctorId && filteredDoctors.length > 0) {
      const selectedDoc = filteredDoctors.find(d => d.name === doctor);
      if (selectedDoc) {
        setDoctorId(selectedDoc._id);
      }
    }
  }, [doctor, doctorId, filteredDoctors]);

  // 5. ✅ FETCH BOOKED SLOTS
  useEffect(() => {
    if (doctorId && date) {
      const fetchBookedSlots = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/auth/booked-slots?doctorId=${doctorId}&date=${date}`);
          setBookedSlots(res.data);
        } catch (err) {
          console.error("Failed to fetch slots:", err);
        }
      };
      fetchBookedSlots();
    } else {
      setBookedSlots([]);
    }
  }, [doctorId, date]);


  /* =======================
      SAVE TO DATABASE LOGIC
  ======================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!serviceName || !doctor || !date || !time || !phone) {
      alert("Please fill all details");
      return;
    }

    try {
      setSubmitting(true);
      const appointmentData = {
        patientId: user?.id || user?._id,
        patientName: user?.name,
        service: serviceName,
        doctorName: doctor,
        doctorId: doctorId, // ✅ Sent to backend
        date,
        time,
        phone,
        status: "Pending"
      };

      // ✅ Backend route call
      await axios.post("http://localhost:5000/api/auth/book-appointment", appointmentData);

      alert(`Success! Appointment confirmed with Dr. ${doctor}`);
      navigate("/profile");
    } catch (err) {
      console.error("Booking Error:", err);
      alert(err.response?.data?.msg || "Failed to book appointment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="py-40 flex justify-center"><Loader2 className="animate-spin text-primary" size={40} /></div>;

  return (
    <section className="bg-slate-50 min-h-screen pt-32 pb-20">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-black text-slate-900 mb-4 italic tracking-tight">
          Book <span className="text-primary">Appointment</span>
        </h2>

        <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl space-y-6 text-left border border-slate-100">

          {/* SELECT SERVICE (Dynamic from Admin) */}
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Select Department</label>
            <div className="relative mt-2">
              <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
              <select
                value={serviceName}
                onChange={(e) => {
                  setServiceName(e.target.value);
                  setDoctor("");
                  setDoctorId(""); // ✅ Reset doctorId on service change
                }}
                className="w-full pl-12 pr-4 py-4 rounded-2xl ring-1 ring-slate-100 font-bold outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                required
              >
                <option value="">Choose Service</option>
                {allServices.map((s) => (
                  <option key={s._id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* SELECT DOCTOR (Filtered based on Service) */}
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Available Specialist</label>
            <div className="relative mt-2">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
              <select
                value={doctor}
                onChange={(e) => {
                  setDoctor(e.target.value);
                  // ✅ Find the selected doctor object to get its ID
                  const selectedDoc = filteredDoctors.find(d => d.name === e.target.value);
                  setDoctorId(selectedDoc ? selectedDoc._id : "");
                }}
                disabled={!serviceName}
                className="w-full pl-12 pr-4 py-4 rounded-2xl ring-1 ring-slate-100 font-bold outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer disabled:bg-slate-50"
                required
              >
                <option value="">{serviceName ? "Choose Doctor" : "Select Service First"}</option>
                {filteredDoctors.map((doc) => (
                  <option key={doc._id} value={doc.name}>Dr. {doc.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Date</label>
              <input type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-6 py-4 rounded-2xl ring-1 ring-slate-100 font-bold" required />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Time Slot</label>
              <select value={time} onChange={(e) => setTime(e.target.value)} className="w-full px-6 py-4 rounded-2xl ring-1 ring-slate-100 font-bold" required disabled={!date || !doctorId}>
                <option value="">{(!date || !doctorId) ? "Select Doctor & Date First" : "Select Time"}</option>
                {["09:00 AM", "11:00 AM", "02:00 PM"].map((slot) => (
                  <option key={slot} value={slot} disabled={bookedSlots.includes(slot)}>
                    {slot} {bookedSlots.includes(slot) ? "(Booked)" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Contact Number</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 00000 00000" className="w-full px-6 py-4 rounded-2xl ring-1 ring-slate-100 font-bold" required />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xl hover:bg-primary transition-all shadow-xl active:scale-95 disabled:bg-slate-400 flex justify-center items-center gap-2"
          >
            {submitting ? <Loader2 className="animate-spin" /> : "CONFIRM APPOINTMENT"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Appointment;