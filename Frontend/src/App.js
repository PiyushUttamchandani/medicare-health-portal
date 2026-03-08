import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Doctors from "./pages/Doctors";
import Appointment from "./pages/Appointment";
import Contact from "./pages/Contact";
import DoctorDetails from "./pages/DoctorDetails";
import Profile from "./pages/Profile";
import AppointmentHistory from "./pages/AppointmentHistory"; // ✅ Import confirmed

// Auth & Security
import Auth, { AuthProvider } from "./utils/Auth"; 
import ProtectedRoute from "./components/ProtectedRoute";

// Admin
import AdminLayout from "./layout/AdminLayout";
import Dashboard from "./admin/Dashboard";
import AdminDoctors from "./admin/Doctors";
import AdminMessages from "./admin/Messages";
import UserManagement from "./admin/UserManagement";
import AddDoctorForm from "./admin/AddDoctorForm";
import AdminServices from "./admin/AdminServices";

// ✅ Doctor Portal
import DoctorLogin from "./doctor/DoctorLogin";
import DoctorDashboard from "./doctor/DoctorDashboard";

function AppContent() {
  const location = useLocation();
  
  // ✅ Dashboard & Admin Checks
  const isAdmin = location.pathname.startsWith("/admin");
  
  // 🚀 FIXED LOGIC: Navbar/Footer sirf Login aur Dashboard panel par hide honge
  const isDoctorPortal = location.pathname === "/doctor/login" || 
                         location.pathname === "/doctor/dashboard";

  // Check if we are on any specialized dashboard layout
  const isDashboardLayout = isAdmin || isDoctorPortal;

  return (
    <>
      {/* Navbar & Footer logic */}
      {!isDashboardLayout && <Navbar />}
      
      <main className={`${!isDashboardLayout ? "pt-20" : ""} min-h-screen`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* ✅ Database Connected Doctor Profile (Publicly Visible) */}
          <Route path="/doctor/:id" element={<DoctorDetails />} />
          
          <Route path="/auth" element={<Auth />} />

          {/* ✅ Patient Protected Routes */}
          <Route 
            path="/profile" 
            element={<ProtectedRoute allowedRole="patient"><Profile /></ProtectedRoute>} 
          />
          
          {/* ✅ FIXED: Appointment History Route (Jo miss ho raha tha) */}
          <Route 
            path="/appointment-history" 
            element={<ProtectedRoute allowedRole="patient"><AppointmentHistory /></ProtectedRoute>} 
          />
          
          {/* ✅ Appointment Page: Login mandatory to prevent "Booking Error" */}
          <Route 
            path="/appointment" 
            element={<ProtectedRoute allowedRole="patient"><Appointment /></ProtectedRoute>} 
          />

          {/* Admin Routes (Wrapped in AdminLayout) */}
          <Route path="/admin" element={<AdminLayout><Dashboard /></AdminLayout>} />
          <Route path="/admin/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
          <Route path="/admin/doctors" element={<AdminLayout><AdminDoctors /></AdminLayout>} />
          <Route path="/admin/messages" element={<AdminLayout><AdminMessages /></AdminLayout>} />
          <Route path="/admin/users" element={<AdminLayout><UserManagement /></AdminLayout>} />
          <Route path="/admin/add-doctor" element={<AdminLayout><AddDoctorForm /></AdminLayout>} />
          <Route path="/admin/services" element={<AdminLayout><AdminServices /></AdminLayout>} />

          {/* ✅ DOCTOR PORTAL ROUTES */}
          <Route path="/doctor" element={<Navigate to="/doctor/login" replace />} />
          <Route path="/doctor/login" element={<DoctorLogin />} />
          
          <Route 
            path="/doctor/dashboard" 
            element={
              <ProtectedRoute allowedRole="doctor">
                <DoctorDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isDashboardLayout && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider> 
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;