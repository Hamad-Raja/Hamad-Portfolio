import React from "react";
import Container from "../components/Container.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import { Braces, Database, Layers3, Rocket, ShieldCheck } from "lucide-react";

const skills = [
  { name: "React", level: 92, tone: "from-cyan-300 to-sky-500" },
  { name: "Next.js", level: 90, tone: "from-zinc-100 to-slate-400" },
  { name: "Node.js", level: 88, tone: "from-emerald-300 to-teal-500" },
  { name: "Express", level: 86, tone: "from-slate-200 to-slate-400" },
  { name: "MongoDB", level: 84, tone: "from-green-300 to-lime-500" },
  { name: "MySQL", level: 82, tone: "from-blue-300 to-cyan-500" },
  { name: "Tailwind CSS", level: 90, tone: "from-sky-300 to-cyan-400" },
  { name: "JWT Auth", level: 82, tone: "from-rose-300 to-pink-500" },
];

const strengths = [
  { icon: Layers3, title: "Clean UI Systems", text: "Reusable components, responsive layouts, and polished interaction states." },
  { icon: Braces, title: "Readable Code", text: "Project structure and logic that stays easy to maintain as features grow." },
  { icon: Database, title: "Database Flow", text: "MongoDB and MySQL models with API contracts designed for real app usage." },
  { icon: Rocket, title: "Shipping Mindset", text: "Focused on features that look good, work smoothly, and feel complete." },
];

const stack = [
  "React", "Next.js", "Node.js", "Express", "MongoDB", "MySQL", "Tailwind", "Mongoose",
  "REST APIs", "JWT", "Git", "Deployment", "Responsive UI", "Admin Panels",
];

export default function About() {
  return (
    <Container className="py-16">
      <SectionTitle
        eyebrow="About"
        title="Full-stack work with a strong UI finish"
        subtitle="I focus on MERN products that combine a refined frontend experience with dependable backend architecture."
      />

      <div className="grid min-w-0 gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="min-w-0 overflow-hidden rounded-lg border border-white/10 bg-white/[0.055] p-5 shadow-soft backdrop-blur-2xl animate-reveal sm:p-7">
          <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-teal-300/30 bg-slate-950 shadow-glow">
              <img
                src="/my.jpg"
                alt="Hammad Zahoor"
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="min-w-0">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-teal-300 to-sky-400 text-slate-950">
                <ShieldCheck size={21} />
              </div>
              <h3 className="mt-3 break-words text-2xl font-black leading-tight text-white">
                My focus
              </h3>
            </div>
          </div>

          <p className="mt-5 break-words text-sm leading-7 text-slate-300/85">
            I'm a Full-Stack MERN Developer who enjoys building clean interfaces
            and reliable backend systems. I care about readable code, smooth user
            flows, responsive design, and APIs that stay simple to work with.
          </p>
          <p className="mt-4 break-words text-sm leading-7 text-slate-300/85">
            I work across frontend and backend - from React and Next.js
            components, routing, and layouts to Express APIs, MongoDB and MySQL
            modeling, authentication, and admin dashboards.
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {strengths.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="min-w-0 rounded-lg border border-white/10 bg-slate-950/35 p-4 transition duration-300 hover:-translate-y-1 hover:border-teal-300/40 hover:bg-teal-300/10 animate-reveal"
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <Icon size={18} className="text-teal-200" />
                  <div className="mt-3 break-words text-sm font-bold text-white">
                    {item.title}
                  </div>
                  <p className="mt-2 break-words text-xs leading-5 text-slate-400">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid min-w-0 gap-6">
          <div className="min-w-0 overflow-hidden rounded-lg border border-white/10 bg-white/[0.055] p-5 shadow-soft backdrop-blur-2xl animate-reveal [animation-delay:120ms] sm:p-7">
            <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
              <h3 className="min-w-0 break-words text-xl font-black leading-tight text-white">
                Animated Stack
              </h3>
              <span className="rounded-full border border-teal-300/20 bg-teal-300/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-teal-100">
                MERN
              </span>
            </div>

            <div className="mt-6 grid gap-4">
              {skills.map((skill, index) => (
                <div key={skill.name} className="group min-w-0">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="min-w-0 truncate pr-3 text-slate-200">{skill.name}</span>
                    <span className="text-slate-400">{skill.level}%</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800/80">
                    <div
                      className={`h-full origin-left rounded-full bg-gradient-to-r ${skill.tone} animate-meter`}
                      style={{
                        width: `${skill.level}%`,
                        animationDelay: `${index * 100}ms`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="min-w-0 overflow-hidden rounded-lg border border-white/10 bg-white/[0.055] p-5 shadow-soft backdrop-blur-2xl animate-reveal [animation-delay:220ms]">
            <div className="max-w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
              <div className="flex w-max gap-3 animate-marquee">
                {[...stack, ...stack].map((item, index) => (
                  <span
                    key={`${item}-${index}`}
                    className="inline-flex min-w-max rounded-full border border-white/10 bg-slate-950/55 px-4 py-2 text-xs font-semibold text-slate-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
