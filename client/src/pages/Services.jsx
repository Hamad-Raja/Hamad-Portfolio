import React from "react";
import Container from "../components/Container.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import {
  Code2,
  Database,
  Gauge,
  Layout,
  Server,
  ShieldCheck,
} from "lucide-react";

const services = [
  {
    icon: Layout,
    title: "Frontend Development",
    desc: "Responsive React and Next.js interfaces, reusable components, routing, state handling, and fast user flows.",
    accent: "from-cyan-300 to-sky-500",
  },
  {
    icon: Server,
    title: "Backend APIs",
    desc: "Express REST APIs with clean controllers, authentication, validation, and production-friendly structure.",
    accent: "from-teal-300 to-emerald-500",
  },
  {
    icon: Database,
    title: "MongoDB, MySQL & Mongoose",
    desc: "Practical schemas, relationships, indexes, and data models that keep apps easy to scale.",
    accent: "from-green-300 to-lime-500",
  },
  {
    icon: Code2,
    title: "Full-Stack MERN",
    desc: "Complete MERN applications from polished UI to database-backed features and deployment setup.",
    accent: "from-amber-300 to-orange-500",
  },
  {
    icon: ShieldCheck,
    title: "Security Basics",
    desc: "JWT auth, safe defaults, CORS handling, protected routes, and common web risk reduction.",
    accent: "from-rose-300 to-pink-500",
  },
  {
    icon: Gauge,
    title: "Optimization",
    desc: "Sharper loading states, better responsiveness, cleaner UI, and practical performance improvements.",
    accent: "from-violet-300 to-fuchsia-500",
  },
];

export default function Services({ embedded = false }) {
  return (
    <Container className="py-16">
      <SectionTitle
        as={embedded ? "h2" : "h1"}
        eyebrow="Services"
        title="What I can build for you"
        subtitle="Clean interfaces, reliable backend systems, and complete MERN products built with a professional delivery mindset."
      />

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {services.map((s, index) => {
          const Icon = s.icon;
          const Heading = embedded ? "h3" : "h2";
          return (
            <div
              key={s.title}
              className="group relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.055] p-6 shadow-soft backdrop-blur-2xl transition duration-300 hover:-translate-y-2 hover:border-teal-300/40 hover:bg-white/[0.085] animate-reveal"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div
                className={`absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br ${s.accent} opacity-20 blur-2xl transition duration-500 group-hover:opacity-35`}
              />
              <div className="relative flex items-center gap-4">
                <div
                  className={`grid h-12 w-12 place-items-center rounded-lg bg-gradient-to-br ${s.accent} text-slate-950 shadow-[0_12px_40px_rgba(45,212,191,0.16)]`}
                >
                  <Icon size={22} />
                </div>
                <Heading className="text-base font-semibold leading-snug text-white sm:text-lg lg:text-xl">{s.title}</Heading>
              </div>
              <p className="relative mt-4 text-sm leading-6 text-slate-300/80">
                {s.desc}
              </p>
              <div className="relative mt-5 h-1.5 overflow-hidden rounded-full bg-slate-800/80">
                <div
                  className={`h-full w-2/3 rounded-full bg-gradient-to-r ${s.accent} transition-all duration-500 group-hover:w-full`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Container>
  );
}
