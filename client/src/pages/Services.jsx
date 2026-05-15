import React from "react";
import Container from "../components/Container.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import { Code2, Server, Database, ShieldCheck, Gauge, Layout } from "lucide-react";

const services = [
  {
    icon: Layout,
    title: "Frontend Development",
    desc: "Responsive UI, reusable components, routing, state handling, and performance-focused React apps.",
  },
  {
    icon: Server,
    title: "Backend APIs",
    desc: "REST APIs with Express, authentication (JWT), validation, rate limiting, and clean architecture.",
  },
  {
    icon: Database,
    title: "MongoDB & Mongoose",
    desc: "Schema design, indexes, aggregation, and data modeling for scalable apps.",
  },
  {
    icon: Code2,
    title: "Full-Stack MERN",
    desc: "Complete MERN apps from UI to database, with deployment-ready configurations.",
  },
  {
    icon: ShieldCheck,
    title: "Security Basics",
    desc: "Helmet, CORS, token auth, and safe defaults to reduce common web risks.",
  },
  {
    icon: Gauge,
    title: "Optimization",
    desc: "Clean UI, faster load times, and better Lighthouse scores with practical improvements.",
  },
];

export default function Services() {
  return (
    <Container className="py-14">
      <SectionTitle
        eyebrow="Services"
        title="What I can build for you"
        subtitle="Demo content for now — you can replace it with your actual services later."
      />

      <div className="grid gap-6 md:grid-cols-3">
        {services.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="glass rounded-3xl p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-slate-900/40 p-3 border border-slate-800/60">
                  <Icon size={20} className="text-sky-300" />
                </div>
                <div className="text-base font-semibold">{s.title}</div>
              </div>
              <p className="mt-3 text-sm text-slate-300/80 leading-6">{s.desc}</p>
            </div>
          );
        })}
      </div>
    </Container>
  );
}
