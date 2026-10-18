import React, { useEffect, useState } from "react";
import Container from "../components/Container.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import Button from "../components/Button.jsx";
import { api } from "../lib/api.js";
import { ExternalLink, Github, Layers3 } from "lucide-react";

function ProjectCard({ p, index }) {
  return (
    <div
      className="group overflow-hidden rounded-lg border border-white/10 bg-white/[0.055] shadow-soft backdrop-blur-2xl transition duration-300 hover:-translate-y-2 hover:border-teal-300/40 hover:bg-white/[0.085] animate-reveal"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <div className="relative h-60 w-full overflow-hidden bg-slate-950">
        {p.imageUrl ? (
          <img
            src={p.imageUrl}
            alt={p.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_50%_18%,rgba(45,212,191,0.22),transparent_35%),linear-gradient(135deg,rgba(15,23,42,0.98),rgba(2,6,23,0.98))] text-slate-500">
            <Layers3 size={36} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent" />
        {p.featured && (
          <span className="absolute left-4 top-4 rounded-full border border-amber-200/25 bg-amber-300/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-amber-100 backdrop-blur-xl">
            Featured
          </span>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-extrabold text-white transition group-hover:text-teal-100">
          {p.title}
        </h3>
        <p className="mt-3 text-sm leading-7 text-slate-300/80">{p.description}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {(p.tech || []).map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/10 bg-slate-950/45 px-3 py-1 text-[11px] font-semibold text-slate-200/90 transition group-hover:border-teal-300/30"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {p.liveUrl ? (
            <Button as="a" href={p.liveUrl} target="_blank" rel="noreferrer">
              Live Demo <ExternalLink size={16} />
            </Button>
          ) : (
            <Button variant="ghost" disabled title="Add liveUrl from Admin">
              Live Demo
            </Button>
          )}

          {p.githubUrl ? (
            <Button variant="ghost" as="a" href={p.githubUrl} target="_blank" rel="noreferrer">
              GitHub <Github size={16} />
            </Button>
          ) : (
            <Button variant="ghost" disabled title="Add githubUrl from Admin">
              GitHub
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.055] shadow-soft backdrop-blur-2xl">
      <div className="h-60 animate-pulse bg-slate-800/60" />
      <div className="space-y-4 p-6">
        <div className="h-5 w-1/2 rounded-full bg-slate-800/80" />
        <div className="h-3 w-full rounded-full bg-slate-800/70" />
        <div className="h-3 w-5/6 rounded-full bg-slate-800/70" />
      </div>
    </div>
  );
}

export default function Projects() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/projects")
      .then((r) => setItems(r.data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container className="py-16">
      <SectionTitle
        eyebrow="Projects"
        title="My Work"
        subtitle="See how we turn ideas into meaningful and impactful digital experiences."
      />

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : items.length ? (
        <div className="grid gap-6 md:grid-cols-2">
          {items.map((p, index) => (
            <ProjectCard key={p._id} p={p} index={index} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-white/10 bg-white/[0.055] p-6 text-sm text-slate-300/80 shadow-soft backdrop-blur-2xl">
          No projects found yet.
        </div>
      )}
    </Container>
  );
}
