import React, { useState, createContext, useContext, useEffect } from "react";
import { Mail, Lock, User, ArrowRight, Stethoscope } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();

  // ✅ Step 1: Page refresh par user recover karna aur block status check karna
  useEffect(() => {
    const initAuth = async () => {
      const savedUser = localStorage.getItem("medicare_user");
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        
        try {
          // Backend se check karo ki user abhi bhi active hai ya block ho gaya
          const res = await axios.get(`http://localhost:5000/api/auth/user-status/${parsedUser.id}`);
          
          if (res.data.isBlocked) {
            // Agar Admin ne block kar diya hai toh nikaal do
            localStorage.removeItem("medicare_user");
            setUser(null);
          } else {
            setUser(parsedUser);
          }
        } catch (err) {
          // Agar server down hai toh saved data rakho
          setUser(parsedUser);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("medicare_user", JSON.stringify(userData));
    navigate("/profile"); 
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("medicare_user");
    localStorage.removeItem("healthProfile"); // Profile data bhi clear karo
    navigate("/auth");
  };

  if (loading) return null; 

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login } = useAuth();
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : { name: formData.fullName, email: formData.email, password: formData.password };

      const res = await axios.post(`http://localhost:5000${endpoint}`, payload);

      if (isLogin) {
        // Login API se ab user object mein 'id' aana chahiye
        login(res.data.user);
      } else {
        alert("Registration Successful! Please Login.");
        setIsLogin(true);
      }
    } catch (err) {
      // ✅ Yahan "isBlocked" wala error message Admin panel se handle hoga
      setError(err.response?.data?.msg || "Something went wrong. Check if backend is running!");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-slate-50/50">
      <div className="max-w-md w-full bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
        
        <div className="text-center mb-10">
          <div className="bg-primary w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-primary/20">
            <Stethoscope className="text-white" size={28} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight italic">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          {error && <p className="text-red-500 text-sm mt-2 font-bold">{error}</p>}
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  required 
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-primary outline-none" 
                  placeholder="Piyush Uttamchandani"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="email" 
                required 
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-primary outline-none" 
                placeholder="name@example.com" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="password" 
                required 
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-primary outline-none" 
                placeholder="••••••••" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-primary text-white py-5 rounded-2xl font-black text-lg hover:bg-primaryDark transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-2 mt-4">
            {isLogin ? "LOGIN" : "SIGN UP"} <ArrowRight size={20} />
          </button>
        </form>

        <div className="mt-8 text-center">
          <button onClick={() => setIsLogin(!isLogin)} className="text-primary font-black hover:underline">
            {isLogin ? "Register Now" : "Login here"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;