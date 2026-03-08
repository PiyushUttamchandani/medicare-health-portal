import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../utils/Auth";

// ✅ allowedRole prop add kiya taaki specific roles ko hi access mile
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user } = useAuth(); // Context se 'user' aur uska 'role' nikaala
  const location = useLocation();

  // 1. Agar user logged in nahi hai, toh /auth par bhej do
  if (!user) {
    return (
      <Navigate
        to="/auth"
        replace
        state={{ from: location }}
      />
    );
  }

  // 2. ✅ ROLE CHECK: Agar route kisi specific role ke liye hai aur user ka role match nahi karta
  //
  if (allowedRole && user.role !== allowedRole) {
    console.warn(`Access Denied: ${user.role} tried to access ${allowedRole} route`);

    // Alert takih user confuse na ho ki achanak redirect kyu ho gaya
    alert(`Aap abhi as a '${user.role}' logged in hain. Book Appointment sirf 'patient' accounts ke liye hai. Kripya pehle logout karein.`);

    // Patient ko Home par aur Doctor ko unke dashboard par redirect karein
    return <Navigate to={user.role === 'doctor' ? "/doctor/dashboard" : "/"} replace />;
  }

  return children;
};

export default ProtectedRoute;