import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Container from "../components/Container.jsx";
import Button from "../components/Button.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import { api } from "../lib/api.js";
import {
  ArrowRight,
  Github,
  Linkedin,
  Mail,
  Sparkles,
} from "lucide-react";
import Services from "./Services.jsx";

const stack = [
  { name: "React", color: "from-cyan-300 to-blue-400" },
  { name: "Next.js", color: "from-zinc-100 to-slate-400" },
  { name: "Node.js", color: "from-emerald-300 to-teal-400" },
  { name: "Express", color: "from-slate-200 to-slate-400" },
  { name: "MongoDB", color: "from-green-300 to-emerald-500" },
  { name: "MySQL", color: "from-blue-300 to-cyan-500" },
  { name: "Tailwind CSS", color: "from-sky-300 to-cyan-400" },
  { name: "REST APIs", color: "from-amber-300 to-orange-400" },
  { name: "JWT Auth", color: "from-rose-300 to-pink-400" },
  { name: "Mongoose", color: "from-lime-300 to-green-500" },
  { name: "Git/GitHub", color: "from-violet-300 to-fuchsia-400" },
  { name: "Deployment", color: "from-indigo-300 to-sky-400" },
];

function Surface({ children, className = "" }) {
  return (
    <div
      className={`min-w-0 rounded-lg border border-white/10 bg-white/[0.055] shadow-soft backdrop-blur-2xl ${className}`}
    >
      {children}
    </div>
  );
}

function Stat({ value, label, delay }) {
  return (
    <Surface
      className={`group p-3 transition duration-300 hover:-translate-y-1 hover:border-teal-300/40 hover:bg-teal-300/10 animate-reveal sm:p-4 ${delay}`}
    >
      <div className="bg-gradient-to-r from-teal-200 via-sky-200 to-amber-200 bg-clip-text text-xl font-extrabold text-transparent sm:text-2xl">
        {value}
      </div>
      <div className="mt-1 text-[11px] font-medium leading-tight text-slate-300/80 sm:text-xs">
        {label}
      </div>
    </Surface>
  );
}

function TechMarquee({ reverse = false }) {
  const items = [...stack, ...stack];

  return (
    <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
      <div
        className={`flex w-max gap-3 py-2 ${
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        }`}
      >
        {items.map((item, index) => (
          <span
            key={`${item.name}-${index}`}
            className="inline-flex min-w-max items-center gap-2 rounded-full border border-white/10 bg-slate-950/60 px-4 py-2 text-xs font-semibold text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl"
          >
            <span
              className={`h-2 w-2 rounded-full bg-gradient-to-r ${item.color} shadow-[0_0_18px_rgba(45,212,191,0.7)]`}
            />
            {item.name}
          </span>
        ))}
      </div>
    </div>
  );
}

function StackShowcase() {
  return (
    <Surface className="mt-12 max-w-full overflow-hidden p-4 animate-reveal [animation-delay:320ms]">
      <div className="mb-2 flex items-center justify-between gap-4 px-1">
        <div className="text-xs font-bold uppercase tracking-[0.22em] text-teal-200">
          Tech Stack
        </div>
        {/* <div className="hidden text-xs text-slate-400 sm:block">
          MERN focused, production ready
        </div> */}
      </div>
      <TechMarquee />
      <TechMarquee reverse />
    </Surface>
  );
}

function ProjectCard({ p }) {
  return (
    <Surface className="group overflow-hidden transition duration-300 hover:-translate-y-2 hover:border-teal-300/40 hover:bg-white/[0.08]">
      <div className="relative h-48 w-full overflow-hidden bg-slate-950">
        {p.imageUrl ? (
          <img
            src={p.imageUrl}
            alt={p.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_50%_20%,rgba(45,212,191,0.18),transparent_34%),linear-gradient(135deg,rgba(15,23,42,0.95),rgba(2,6,23,0.95))] text-sm text-slate-500">
            Project Preview
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />
        <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[11px] font-semibold text-teal-100 backdrop-blur-xl">
          Featured
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between gap-4">
          <h3 className="min-w-0 break-words text-base font-semibold leading-snug text-white sm:text-lg">{p.title}</h3>
          <Link
            to="/projects"
            className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-teal-200 transition hover:text-white"
          >
            View <ArrowRight size={16} />
          </Link>
        </div>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-300/80">
          {p.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {(p.tech || []).slice(0, 4).map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold text-slate-200/90"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </Surface>
  );
}

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api
      .get("/api/projects?featured=true")
      .then((r) => setFeatured(r.data || []))
      .catch(() => setFeatured([]));
  }, []);

  return (
    <div>
      <Container className="relative py-16 sm:py-20 lg:py-24">
        <div className="grid min-w-0 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,340px)] xl:gap-14">
          <div className="min-w-0">
            <div className="inline-flex max-w-full animate-reveal items-center gap-2 rounded-full border border-teal-300/20 bg-teal-300/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-teal-100 sm:text-xs sm:tracking-[0.2em]">
              <Sparkles size={14} /> Available for MERN work
            </div>

            <h1 className="mt-5 max-w-full animate-reveal break-words text-4xl font-semibold leading-[1.15] text-white [animation-delay:80ms] sm:text-5xl xl:text-[52px]">
              <span className="block bg-[linear-gradient(110deg,#f8fafc,#ccfbf1_45%,#7dd3fc_78%)] bg-clip-text text-transparent drop-shadow-[0_18px_55px_rgba(45,212,191,0.16)]">
                Hammad Zahoor
              </span>
              <span className="mt-2 block bg-[linear-gradient(110deg,#ccfbf1,#38bdf8,#fbbf24,#ccfbf1)] bg-[length:220%_100%] bg-clip-text text-[28px] font-medium leading-[1.2] text-transparent animate-shimmer sm:text-4xl xl:text-[40px]">
                Full-Stack Developer
              </span>
            </h1>

            <p className="mt-6 max-w-2xl animate-reveal break-words text-base leading-8 text-slate-300 [animation-delay:160ms]">
              I build modern full-stack applications with polished React and
              Next.js interfaces, reliable APIs, MongoDB and MySQL data models,
              and clean deployment-ready structure.
            </p>

            <div className="mt-8 flex animate-reveal flex-wrap items-center gap-3 [animation-delay:240ms]">
              <Button as={Link} to="/contact">
                Hire Me <ArrowRight size={18} />
              </Button>
              <Button variant="ghost" as="a" href="/cv.pdf">
                Download CV
              </Button>

              <div className="flex items-center gap-3 sm:ml-2">
                {[
                  { icon: Linkedin, label: "LinkedIn" },
                  { icon: Github, label: "GitHub" },
                  { icon: Mail, label: "Email" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.label}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-200 transition duration-300 hover:-translate-y-1 hover:border-teal-300/50 hover:bg-teal-300/10 hover:text-white"
                      href="#"
                      aria-label={item.label}
                    >
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 grid max-w-xl grid-cols-3 gap-2 sm:gap-3">
              <Stat value="2+" label="Years Experience" delay="[animation-delay:260ms]" />
              <Stat value="10+" label="Projects Done" delay="[animation-delay:340ms]" />
              <Stat value="5+" label="Happy Clients" delay="[animation-delay:420ms]" />
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[330px] animate-reveal [animation-delay:180ms] lg:justify-self-end">
            <div className="absolute -left-6 top-8 h-24 w-24 rounded-full bg-teal-300/20 blur-2xl animate-pulse-glow" />
            <div className="absolute -right-6 bottom-10 h-28 w-28 rounded-full bg-amber-300/15 blur-2xl animate-float-slow" />

            <div className="relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.055] p-2 shadow-soft backdrop-blur-2xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_12%,rgba(45,212,191,0.20),transparent_30%),radial-gradient(circle_at_85%_18%,rgba(245,158,11,0.16),transparent_28%)]" />

              <div className="relative overflow-hidden rounded-lg border border-white/10 bg-slate-950">
                <img
                  src="/my.jpg"
                  alt="Hammad Zahoor"
                  className="h-[330px] w-full object-cover object-center transition duration-700 hover:scale-105 sm:h-[360px] lg:h-[390px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>

        <StackShowcase />
      </Container>

      <Services embedded />

      <Container className="pb-16">
        <SectionTitle
          eyebrow="Featured Work"
          title="Projects that show real MERN skills"
          // subtitle="Selected work powered by the existing MongoDB project API. Update projects anytime from the admin dashboard."
        />

        {featured.length ? (
          <div className="grid gap-6 md:grid-cols-3">
            {featured.slice(0, 3).map((p, index) => (
              <div
                key={p._id}
                className="min-w-0 animate-reveal"
                style={{ animationDelay: `${index * 90}ms` }}
              >
                <ProjectCard p={p} />
              </div>
            ))}
          </div>
        ) : (
          <Surface className="p-6 text-sm text-slate-300/80">
            Featured projects will appear here from your backend.
          </Surface>
        )}

        <div className="mt-8">
          <Button as={Link} to="/projects" variant="ghost">
            View All Projects <ArrowRight size={18} />
          </Button>
        </div>
      </Container>
    </div>
  );
}
