import React from "react";
import { Github, Linkedin, Twitter, Facebook, Instagram, MessageCircle, BriefcaseBusiness, Mail, Phone } from "lucide-react";
import { site } from "../config/site.js";

const profiles = [
  ["github", "GitHub", Github], ["linkedin", "LinkedIn", Linkedin],
  ["twitter", "X / Twitter", Twitter], ["facebook", "Facebook", Facebook],
  ["instagram", "Instagram", Instagram], ["whatsapp", "WhatsApp", MessageCircle],
  ["upwork", "Upwork", BriefcaseBusiness], ["fiverr", "Fiverr", BriefcaseBusiness],
];

export default function SocialLinks() {
  const links = profiles.map(([key, label, Icon]) => ({ href: site.social[key], label, Icon, external: true }));
  links.push({ href: site.emailHref, label: "Email", Icon: Mail }, { href: site.phoneHref, label: "Phone", Icon: Phone });
  const configured = links.filter(link => link.href);
  if (!configured.length) return null;
  return <div className="flex flex-wrap gap-3">
    {configured.map(({ href, label, Icon, external }) => <a key={label} href={href} aria-label={label} title={label}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-slate-200 transition hover:border-teal-300/50 hover:bg-teal-300/10 hover:text-teal-200">
      <Icon size={18} aria-hidden="true" />
    </a>)}
  </div>;
}
