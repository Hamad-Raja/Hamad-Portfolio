import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Container from "../components/Container.jsx";
import Button from "../components/Button.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import { api } from "../lib/api.js";
import { Github, Linkedin, Mail, ArrowRight } from "lucide-react";
import myImage from "/my.jpg";
import Services from "./Services.jsx";

function Stat({ value, label }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="text-2xl font-bold bg-gradient-to-r from-sky-300 via-indigo-300 to-blue-300 bg-clip-text text-transparent">
        {value}
      </div>
      <div className="mt-1 text-xs text-slate-300/80">{label}</div>
    </div>
  );
}

function ProjectCard({ p }) {
  return (
    <div className="glass overflow-hidden rounded-3xl">
      <div className="h-44 w-full bg-slate-900">
        {p.imageUrl ? (
          <img
            src={p.imageUrl}
            alt={p.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-500 text-sm">
            Project Image
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-base font-semibold">{p.title}</h3>
          <Link
            to="/projects"
            className="text-sky-300 text-sm inline-flex items-center gap-1"
          >
            View <ArrowRight size={16} />
          </Link>
        </div>
        <p className="mt-2 text-sm text-slate-300/80 line-clamp-3">
          {p.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {(p.tech || []).slice(0, 4).map((t) => (
            <span
              key={t}
              className="rounded-full border border-slate-700/60 bg-slate-900/30 px-2.5 py-1 text-[11px] text-slate-200/85"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
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
      <Container className="py-14">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <div className="text-sm text-slate-300/80">Hi, I am</div>
            <h1 className="mt-2 text-4xl font-extrabold sm:text-5xl">
              <span className="bg-gradient-to-r from-sky-300 via-indigo-300 to-blue-300 bg-clip-text text-transparent">
                Hammad Zahoor
              </span>
            </h1>
            <p className="mt-3 text-lg font-semibold text-slate-100">
              Full-Stack MERN Developer
            </p>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300/80">
              I build modern, fast, and scalable web applications using React,
              Node.js, Express, MongoDB, and Tailwind CSS — with clean UI and
              production-ready backend APIs. (Demo content — you can replace
              with your own anytime.)
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button as={Link} to="/contact">
                Hire Me
              </Button>
              <Button variant="ghost" as="a" href="/cv.pdf">
                Download CV
              </Button>

              <div className="ml-0 flex items-center gap-3 sm:ml-3">
                <a
                  className="rounded-xl border border-slate-800/70 p-2 hover:border-sky-400/60"
                  href="#"
                >
                  <Linkedin size={18} />
                </a>
                <a
                  className="rounded-xl border border-slate-800/70 p-2 hover:border-sky-400/60"
                  href="#"
                >
                  <Github size={18} />
                </a>
                <a
                  className="rounded-xl border border-slate-800/70 p-2 hover:border-sky-400/60"
                  href="#"
                >
                  <Mail size={18} />
                </a>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4">
              <Stat value="2+" label="Years Experience" />
              <Stat value="10+" label="Projects Done" />
              <Stat value="5+" label="Happy Clients" />
            </div>
          </div>

          <div className="relative">
            <div className="mx-auto aspect-square w-full max-w-md rounded-[40px] border border-slate-800/60 bg-slate-900/30 shadow-glow flex items-center justify-center">
              <div className="h-56 w-56 rounded-full overflow-hidden border-2 border-sky-400">
                <img
                  src={myImage}
                  alt="Profile"
                  className="h-full w-full object-cover object-center"
                />
              </div>
            </div>

            <div className="pointer-events-none absolute -inset-6 rounded-[50px] bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-blue-500/10 blur-2xl" />
          </div>
        </div>
      </Container>

      <div>
        <Services />
      </div>
      <Container className="pb-14">
        <SectionTitle
          eyebrow="Featured Work"
          title="Projects that show real MERN skills"
          subtitle="These are demo projects seeded from the backend. You can edit them in the Admin dashboard."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {featured.slice(0, 3).map((p) => (
            <ProjectCard key={p._id} p={p} />
          ))}
        </div>

        <div className="mt-8">
          <Button as={Link} to="/projects" variant="ghost">
            View All Projects <ArrowRight size={18} />
          </Button>
        </div>
      </Container>

    </div>

  );
}
