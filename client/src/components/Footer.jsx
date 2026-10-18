import React from "react";
import { Link } from "react-router-dom";
import { Github, Linkedin, Twitter, Facebook, Instagram, MessageCircle, Mail, Phone, ArrowUpRight } from "lucide-react";
import Container from "./Container.jsx";
import logo from "/logoHZ.png";

function publicUrl(value) {
  const input = value?.trim();
  if (!input || !/^https?:\/\//i.test(input)) return null;
  try {
    const url = new URL(input);
    return !url.username && !url.password ? url.href : null;
  } catch {
    return null;
  }
}

const env = import.meta.env;
const email = env.VITE_CONTACT_EMAIL?.trim() || "";
const phone = env.VITE_CONTACT_PHONE?.trim() || "";
const socialLinks = [
  { label: "GitHub", icon: Github, href: publicUrl(env.VITE_GITHUB_URL) },
  { label: "LinkedIn", icon: Linkedin, href: publicUrl(env.VITE_LINKEDIN_URL) },
  { label: "X / Twitter", icon: Twitter, href: publicUrl(env.VITE_TWITTER_URL) },
  { label: "Facebook", icon: Facebook, href: publicUrl(env.VITE_FACEBOOK_URL) },
  { label: "Instagram", icon: Instagram, href: publicUrl(env.VITE_INSTAGRAM_URL) },
  { label: "WhatsApp", icon: MessageCircle, href: publicUrl(env.VITE_WHATSAPP_URL) },
  { label: "Email", icon: Mail, href: /^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(email) ? `mailto:${email}` : null },
  { label: "Phone", icon: Phone, href: /^\+?[\d ()-]{7,25}$/.test(phone) && phone.replace(/\D/g, "").length >= 7 ? `tel:${phone.replace(/[^+\d]/g, "")}` : null },
].filter(link => link.href);

const quickLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/projects", label: "Projects" },
  { to: "/contact", label: "Contact" },
];
const services = ["Frontend Development", "Backend Development", "Full-Stack Development", "API Integration"];
const linkClass = "inline-flex min-h-9 items-center rounded text-sm text-slate-300 transition-colors hover:text-teal-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300/70 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/60">
      <Container className="py-12 sm:py-14">
        <div className="grid min-w-0 gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_1.1fr_1fr] lg:gap-8">
          <div className="min-w-0">
            <Link to="/" aria-label="Hammad Zahoor home" className="inline-flex items-center gap-3 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300/70">
              <img src={logo} alt="" className="h-10 w-10 object-contain" />
              <span className="bg-gradient-to-r from-teal-200 via-sky-200 to-amber-200 bg-clip-text text-lg font-semibold text-transparent">
                Hammad Zahoor
              </span>
            </Link>
            <p className="mt-3 text-sm font-medium text-teal-200">Full-Stack Developer</p>
            <p className="mt-4 max-w-xs text-sm leading-7 text-slate-300">
              Building modern web applications with thoughtful interfaces and dependable backend systems.
            </p>
          </div>

          <nav aria-label="Footer navigation" className="min-w-0">
            <h2 className="mb-4 text-base font-semibold text-white">Quick Links</h2>
            <ul className="space-y-1">
              {quickLinks.map(link => (
                <li key={link.to}><Link to={link.to} className={linkClass}>{link.label}</Link></li>
              ))}
            </ul>
          </nav>

          <div className="min-w-0">
            <h2 className="mb-4 text-base font-semibold text-white">Services</h2>
            <ul className="space-y-1">
              {services.map(service => (
                <li key={service}><Link to="/services" className={linkClass}>{service}</Link></li>
              ))}
            </ul>
          </div>

          <div className="min-w-0">
            <h2 className="mb-4 text-base font-semibold text-white">Connect</h2>
            {socialLinks.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {socialLinks.map(({ label, icon: Icon, href }) => (
                  <a key={label} href={href} aria-label={label} title={label}
                    {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-300 transition duration-300 hover:-translate-y-0.5 hover:border-teal-300/50 hover:bg-teal-300/10 hover:text-teal-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950">
                    <Icon size={18} aria-hidden="true" />
                  </a>
                ))}
              </div>
            )}
            <Link to="/contact" className={`${linkClass} gap-2 text-teal-200`}>
              Let&apos;s talk <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6">
          <p className="text-xs leading-6 text-slate-400">
            &copy; {new Date().getFullYear()} Hammad Zahoor. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
