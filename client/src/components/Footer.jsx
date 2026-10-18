import React from "react";
import { Link } from "react-router-dom";
import Container from "./Container.jsx";
import SocialLinks from "./SocialLinks.jsx";
import { site } from "../config/site.js";
const links = [["/", "Home"], ["/about", "About"], ["/services", "Services"], ["/projects", "Projects"], ["/contact", "Contact"]];
export default function Footer() {
  return <footer className="border-t border-white/10 bg-[#040811]">
    <Container className="py-12">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_1.1fr_1fr]">
        <div><Link to="/" className="text-lg font-semibold text-white">{site.name}</Link><p className="mt-2 text-sm text-teal-200">{site.role}</p><p className="mt-4 max-w-xs text-sm leading-7 text-slate-300">Building modern, scalable, and user-focused digital experiences.</p></div>
        <nav aria-label="Footer"><h2 className="mb-4 text-sm font-semibold text-white">Quick Links</h2><ul className="space-y-1">{links.map(([to, label]) => <li key={to}><Link className="inline-flex min-h-9 items-center text-sm text-slate-300 hover:text-teal-200" to={to}>{label}</Link></li>)}</ul></nav>
        <div><h2 className="mb-4 text-sm font-semibold text-white">Services</h2><ul className="space-y-1">{["Frontend Development", "Backend Development", "Full-Stack Applications", "API Integration"].map(label => <li key={label}><Link to="/services" className="inline-flex min-h-9 items-center text-sm text-slate-300 hover:text-teal-200">{label}</Link></li>)}</ul></div>
        <div><h2 className="mb-4 text-sm font-semibold text-white">Let's Connect</h2><SocialLinks /><Link className="mt-4 inline-flex min-h-11 items-center text-sm text-teal-200 hover:underline" to="/contact">Discuss a project</Link></div>
      </div>
      <div className="mt-10 border-t border-white/10 pt-6 text-xs leading-6 text-slate-400">{"\u00a9"} {new Date().getFullYear()} {site.name}. All rights reserved.</div>
    </Container>
  </footer>;
}
