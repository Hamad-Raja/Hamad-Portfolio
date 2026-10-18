import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

import Home from "./pages/Home.jsx";
import Services from "./pages/Services.jsx";
import About from "./pages/About.jsx";
import Projects from "./pages/Projects.jsx";
import Contact from "./pages/Contact.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";

import { getToken } from "./lib/storage.js";
import { setAuthToken } from "./lib/api.js";

function Protected({ children }) {
  const token = getToken();
  if (!token) return <Navigate to="/admin" replace />;
  return children;
}

export default function App() {
  const { pathname } = useLocation();
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");
  useEffect(() => {
    const token = getToken();
    setAuthToken(token || "");
  }, []);

  return (
    <div className="relative isolate min-h-screen overflow-x-hidden bg-[#050612] text-slate-100">
      <div className="pointer-events-none fixed inset-0 -z-20 bg-[radial-gradient(circle_at_18%_12%,rgba(45,212,191,0.20),transparent_30%),radial-gradient(circle_at_78%_10%,rgba(251,113,133,0.16),transparent_28%),radial-gradient(circle_at_55%_84%,rgba(14,165,233,0.18),transparent_34%),linear-gradient(180deg,#050612_0%,#090b16_48%,#050612_100%)]" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(rgba(148,163,184,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.055)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_82%)]" />
      <div className="pointer-events-none fixed left-[-10rem] top-20 -z-10 h-80 w-80 rounded-full bg-teal-400/20 blur-3xl animate-pulse-glow" />
      <div className="pointer-events-none fixed right-[-8rem] top-64 -z-10 h-96 w-96 rounded-full bg-rose-400/10 blur-3xl animate-float-slow" />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <Protected>
              <AdminDashboard />
            </Protected>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!isAdmin && <Footer />}
    </div>
  );
}
