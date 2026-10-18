import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Container from "./Container.jsx";
import Button from "./Button.jsx";
import { Menu, X } from "lucide-react";
import { site } from "../config/site.js";

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/projects", label: "Projects" },
  { to: "/contact", label: "Contact" },
];

function LinkItem({ to, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `relative inline-flex min-h-11 items-center py-2 text-sm font-semibold transition duration-300 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:rounded-full after:bg-gradient-to-r after:from-teal-300 after:via-sky-300 after:to-amber-300 after:transition-all after:duration-300 ${
          isActive
            ? "text-white after:w-full"
            : "text-slate-300 after:w-0 hover:text-white hover:after:w-full"
        }`
      }
      end={to === "/"}
    >
      {label}
    </NavLink>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    const close = event => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050612]/70 backdrop-blur-2xl">
      <Container className="h-16">
        <div className="flex h-16 items-center justify-between gap-4">
          <NavLink to="/" className="group flex items-center gap-3">
            <img
              src={`${import.meta.env.BASE_URL}logoHZ.png`}
              alt={`${site.name} home`} width="64" height="40"
              className="h-10 w-auto rounded-xl object-contain transition duration-300 group-hover:scale-105"
            />
          </NavLink>

          <nav aria-label="Main navigation" className="hidden items-center gap-7 rounded-full border border-white/10 bg-white/[0.035] px-5 py-1.5 shadow-soft md:flex">
            {links.map((l) => (
              <LinkItem key={l.to} {...l} />
            ))}
          </nav>

          <div className="hidden md:flex">
            <Button as={NavLink} to="/contact">
              Hire Me
            </Button>
          </div>

          <button
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-100 transition hover:border-teal-300/50 hover:bg-teal-300/10 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {open && (
          <nav id="mobile-navigation" aria-label="Mobile navigation" className="absolute left-4 right-4 top-20 animate-reveal md:hidden">
            <div className="rounded-lg border border-white/10 bg-slate-950/90 p-4 shadow-soft backdrop-blur-2xl">
              <div className="grid gap-3">
                {links.map((l) => (
                  <LinkItem key={l.to} {...l} onClick={() => setOpen(false)} />
                ))}
                <Button as={NavLink} to="/contact" className="mt-2 w-full">
                  Hire Me
                </Button>
              </div>
            </div>
          </nav>
        )}
      </Container>
    </header>
  );
}
