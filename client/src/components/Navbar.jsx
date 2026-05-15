import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Container from "./Container.jsx";
import Button from "./Button.jsx";
import logo1 from "/logoHZ.png";

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
        `link-underline text-sm font-medium transition ${
          isActive ? "text-sky-300" : "text-slate-200/85 hover:text-slate-100"
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

  return (
    <div className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/60 backdrop-blur">
      {/* FIX: Remove py-4 (it increases height). Lock height & center content */}
      <Container className="h-16">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <NavLink to="/" className="flex items-center">
            {/* FIX: Keep logo inside navbar height */}
            <img
              src={logo1}
              alt="HZ Logo"
              className="h-9 w-auto object-contain rounded-lg bg-transparent"
            />
          </NavLink>

          {/* Desktop Links */}
          <div className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <LinkItem key={l.to} {...l} />
            ))}
          </div>

          {/* Desktop Button */}
          <div className="hidden md:flex">
            <Button as={NavLink} to="/contact">
              Hire Me
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden rounded-xl border border-slate-800/70 px-3 py-2 text-sm"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            Menu
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="mt-4 grid gap-3 md:hidden">
            <div className="glass rounded-2xl p-4">
              <div className="grid gap-3">
                {links.map((l) => (
                  <LinkItem key={l.to} {...l} onClick={() => setOpen(false)} />
                ))}
                <Button as={NavLink} to="/contact" className="mt-2 w-full">
                  Hire Me
                </Button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
