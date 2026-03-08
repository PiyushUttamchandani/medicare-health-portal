import React, { useState } from "react";
import axios from "axios";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/contact", formData);
      alert("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("Message send error:", err);
      alert("Failed to send message. Please try again.");
    }
  };

  return (
    <section className="bg-slate-50 min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
            Get In <span className="text-primary">Touch</span>
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Have questions about our medical services? Our team is here to help you
            24/7. Reach out to us via the form or our contact details.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* LEFT SIDE: CONTACT INFO */}
          <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <MessageSquare className="text-primary" /> Contact Information
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-5">
                  <div className="bg-primary/10 p-4 rounded-2xl text-primary shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Our Location</p>
                    <p className="text-slate-600 mt-1">Ahmedabad, Gujarat, India</p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="bg-primary/10 p-4 rounded-2xl text-primary shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Phone Number</p>
                    <p className="text-slate-600 mt-1">+91 98765 43210</p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="bg-primary/10 p-4 rounded-2xl text-primary shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Email Address</p>
                    <p className="text-slate-600 mt-1">medicare@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* QUICK HELP BOX */}
            <div className="bg-primary p-8 rounded-[2.5rem] text-white shadow-lg shadow-primary/20">
              <h3 className="text-xl font-bold mb-2">Emergency Cases</h3>
              <p className="text-white/80 mb-6 text-sm">Our medical team is available for urgent consultations. Please call our emergency hotline.</p>
              <p className="text-2xl font-bold">+91 9173977636</p>
            </div>
          </div>


          {/* RIGHT SIDE: CONTACT FORM */}
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-6 animate-in fade-in slide-in-from-right duration-700"
          >
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">YOUR NAME</label>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 rounded-2xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-primary outline-none transition-all bg-slate-50/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">YOUR EMAIL</label>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 rounded-2xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-primary outline-none transition-all bg-slate-50/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">YOUR MESSAGE</label>
              <textarea
                name="message"
                placeholder="How can we help you?"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                className="w-full px-6 py-4 rounded-2xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-primary outline-none transition-all bg-slate-50/50 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-5 rounded-2xl font-bold text-lg hover:bg-primaryDark transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-3 active:scale-95"
            >
              <Send size={20} /> Send Message
            </button>
          </form>

        </div>
      </div>
    </section>
  );
};

export default Contact;