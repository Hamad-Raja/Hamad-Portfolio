import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Code2, Download, Mail, Sparkles } from "lucide-react";
import Container from "./Container.jsx";
import logo from "/logoHZ.png";

const quickLinks = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/projects", label: "Projects" },
  { to: "/contact", label: "Contact" },
];

const services = [
  "Frontend Development",
  "Backend APIs",
  "Full-Stack MERN",
  "Admin Dashboards",
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-10 overflow-hidden border-t border-white/10 bg-[#050612]/85">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-300/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-teal-300/10 via-sky-300/5 to-transparent" />

      <Container className="relative py-10 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.7fr_0.9fr_1fr]">
          <div className="min-w-0">
            <Link to="/" className="inline-flex items-center gap-3">
              <img
                src={logo}
                alt="HZ Logo"
                className="h-11 w-auto rounded-lg object-contain"
              />
              <span className="min-w-0">
                <span className="block bg-gradient-to-r from-teal-200 via-sky-200 to-amber-200 bg-clip-text text-base font-extrabold text-transparent">
                  Hammad Zahoor
                </span>
                <span className="mt-1 block text-xs font-semibold text-slate-400">
                  Full-Stack MERN Developer
                </span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-300/80">
              Building clean React interfaces, reliable Express APIs, and
              deployment-ready full-stack products with a polished finish.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-teal-300/20 bg-teal-300/10 px-4 py-2 text-xs font-bold text-teal-100">
              <Sparkles size={14} />
              Available for MERN work
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
              Explore
            </h2>
            <nav className="mt-4 grid gap-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="group inline-flex w-fit items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-600 transition group-hover:bg-teal-300" />
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
              Services
            </h2>
            <div className="mt-4 grid gap-3">
              {services.map((service) => (
                <Link
                  key={service}
                  to="/services"
                  className="group inline-flex w-fit items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white"
                >
                  <Code2
                    size={15}
                    className="text-slate-500 transition group-hover:text-teal-200"
                  />
                  {service}
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.045] p-5 shadow-soft backdrop-blur-2xl">
            <h2 className="text-base font-extrabold text-white">
              Ready to start a project?
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-300/80">
              Send a short brief and I will get back with the next step.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(110deg,#2dd4bf,#38bdf8,#f59e0b,#2dd4bf)] bg-[length:220%_100%] px-4 py-2.5 text-sm font-bold text-slate-950 shadow-glow transition duration-300 hover:-translate-y-0.5"
              >
                Contact Me <Mail size={16} />
              </Link>
              <a
                href="/cv.pdf"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-bold text-slate-100 transition duration-300 hover:-translate-y-0.5 hover:border-teal-300/50 hover:bg-teal-300/10"
              >
                CV <Download size={16} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright {year} Hammad Zahoor. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span>React</span>
            <span className="h-1 w-1 rounded-full bg-slate-700" />
            <span>Node.js</span>
            <span className="h-1 w-1 rounded-full bg-slate-700" />
            <span>MongoDB</span>
            <Link
              to="/contact"
              className="inline-flex items-center gap-1 font-semibold text-teal-200 transition hover:text-white"
            >
              Hire Me <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
