import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();
  const location = useLocation();

  // 👇 jahan se user aaya tha (ProtectedRoute se)
  const from = location.state?.from?.pathname || "/";

  /* =======================
     LOGIN HANDLER
  ======================= */
  const handleLogin = (e) => {
    e.preventDefault();

    // ⚠️ fake login (frontend only)
    localStorage.setItem(
      "user",
      JSON.stringify({
        email: "test@test.com",
      })
    );

    navigate(from, { replace: true });
  };

  /* =======================
     REGISTER HANDLER
  ======================= */
  const handleRegister = (e) => {
    e.preventDefault();

    // ⚠️ fake register
    localStorage.setItem(
      "user",
      JSON.stringify({
        email: "newuser@test.com",
      })
    );

    navigate(from, { replace: true });
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-xl">

        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">
            Welcome Back
          </h1>
          <p className="text-slate-500 mt-2">
            Login or create an account to continue
          </p>
        </div>

        {/* TABS */}
        <div className="flex bg-slate-100 rounded-2xl overflow-hidden mb-8">
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 py-3 font-bold transition-all ${
              activeTab === "login"
                ? "bg-primary text-white"
                : "text-slate-600"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`flex-1 py-3 font-bold transition-all ${
              activeTab === "register"
                ? "bg-primary text-white"
                : "text-slate-600"
            }`}
          >
            Register
          </button>
        </div>

        {/* LOGIN FORM */}
        {activeTab === "login" && (
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                placeholder="Email address"
                required
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                placeholder="Password"
                required
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primaryDark transition-all"
            >
              Login
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {activeTab === "register" && (
          <form onSubmit={handleRegister} className="space-y-5">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Full Name"
                required
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                placeholder="Email address"
                required
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                placeholder="Password"
                required
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primaryDark transition-all"
            >
              Create Account
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default AuthPage;
