import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import PageMetadata from "./components/PageMetadata.jsx";

import Home from "./pages/Home.jsx";
import Services from "./pages/Services.jsx";
import About from "./pages/About.jsx";
import Projects from "./pages/Projects.jsx";
import Contact from "./pages/Contact.jsx";

import { getToken } from "./lib/storage.js";
import { setAuthToken } from "./lib/api.js";

const AdminLogin = lazy(() => import("./pages/admin/AdminLogin.jsx"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.jsx"));

function Protected({ children }) {
  const token = getToken();
  if (!token) return <Navigate to="/admin" replace />;
  return children;
}

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const admin = location.pathname.startsWith("/admin");
  useEffect(() => {
    const expired = () => navigate("/admin", { replace: true });
    window.addEventListener("auth-expired", expired);
    return () => window.removeEventListener("auth-expired", expired);
  }, [navigate]);
  useEffect(() => {
    if (location.hash) {
      let id = location.hash.slice(1);
      try { id = decodeURIComponent(id); } catch { /* Ignore malformed URL encoding. */ }
      const target = document.getElementById(id);
      target?.scrollIntoView();
    } else window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);
  useEffect(() => {
    const token = getToken();
    setAuthToken(token || "");
  }, []);

  return (
    <div className="relative isolate min-h-screen overflow-x-hidden bg-[#050612] text-slate-100">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(45,212,191,0.06),transparent_65%)]" />
      <Navbar />
      <PageMetadata />
      <main id="main-content" tabIndex={-1}>
      <Suspense fallback={<p role="status" className="mx-auto max-w-6xl p-6">Loading page...</p>}>
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
      </Suspense>
      </main>
      {!admin && <Footer />}
    </div>
  );
}
