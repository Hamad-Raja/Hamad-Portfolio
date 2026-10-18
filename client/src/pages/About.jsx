import React from "react";
import Container from "../components/Container.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import TechStack from "../components/TechStack.jsx";
import { site } from "../config/site.js";
import PanelHeading from "../components/PanelHeading.jsx";
import { Braces, Database, Layers3, Rocket, ShieldCheck } from "lucide-react";

const strengths = [
  { icon: Layers3, title: "Clean UI Systems", text: "Reusable components, responsive layouts, and polished interaction states." },
  { icon: Braces, title: "Readable Code", text: "Project structure and logic that stays easy to maintain as features grow." },
  { icon: Database, title: "Database Flow", text: "MongoDB and MySQL models with API contracts designed for real app usage." },
  { icon: Rocket, title: "Shipping Mindset", text: "Focused on features that look good, work smoothly, and feel complete." },
];

export default function About() {
  return (
    <Container className="py-16">
      <SectionTitle as="h1"
        eyebrow="About"
        title="Full-stack work with a strong UI finish"
        subtitle="I focus on MERN products that combine a refined frontend experience with dependable backend architecture."
      />

      <div className="grid min-w-0 gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="min-w-0 overflow-hidden rounded-lg border border-white/10 bg-white/[0.055] p-5 shadow-soft backdrop-blur-2xl animate-reveal sm:p-7">
          <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-teal-300/30 bg-slate-950 shadow-glow">
              <img
                src={`${import.meta.env.BASE_URL}my.jpg`}
                loading="lazy" width="96" height="96"
                alt={site.name}
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="min-w-0">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-teal-300 to-sky-400 text-slate-950">
                <ShieldCheck size={21} />
              </div>
              <PanelHeading className="mt-3">My focus</PanelHeading>
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

        <section className="min-w-0 rounded-lg border border-white/10 bg-white/[0.04] p-5 sm:p-7" aria-labelledby="about-stack">
          <h2 id="about-stack" className="mb-6 text-xl font-semibold text-white">Skills and technologies</h2>
          <TechStack compact />
        </section>
      </div>
    </Container>
  );
}
