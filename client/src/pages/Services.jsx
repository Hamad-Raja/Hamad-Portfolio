import React from "react";
import Container from "../components/Container.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import { Code2, Database, Layout, Server } from "lucide-react";
export const services = [
  { icon: Layout, title: "Frontend Development", desc: "Responsive React and Next.js interfaces with reusable components, accessible navigation, and fast, intuitive user flows." },
  { icon: Server, title: "Backend Development", desc: "Express REST APIs with authentication, input validation, protected routes, and a maintainable structure." },
  { icon: Code2, title: "Full-Stack Applications", desc: "Complete MERN applications, from polished interfaces and admin dashboards to database-backed features and deployment." },
  { icon: Database, title: "API and Database Integration", desc: "Connect services and organize application data with REST APIs, MongoDB, Mongoose, and MySQL models." },
];
export default function Services({ embedded = false }) {
  return <Container className="py-16">
    <SectionTitle as={embedded ? "h2" : "h1"} eyebrow="Services" title="What I can build for you" subtitle="Thoughtful interfaces, dependable backend systems, and web applications built for everyday use." />
    <div className="grid gap-5 md:grid-cols-2">{services.map(({ icon: Icon, title, desc }) => {
      const Heading = embedded ? "h3" : "h2";
      return <article key={title} className="rounded-lg border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:border-teal-300/40">
        <div className="mb-5 grid h-12 w-12 place-items-center rounded-lg bg-teal-300/10 text-teal-200"><Icon size={22} aria-hidden="true" /></div>
        <Heading className="text-lg font-semibold text-white">{title}</Heading>
        <p className="mt-3 text-sm leading-7 text-slate-300">{desc}</p>
      </article>;
    })}</div>
  </Container>;
}
