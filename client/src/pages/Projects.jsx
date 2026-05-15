import React, { useEffect, useState } from "react";
import Container from "../components/Container.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import Button from "../components/Button.jsx";
import { api } from "../lib/api.js";
import { ExternalLink, Github } from "lucide-react";

function ProjectCard({ p }) {
  return (
    <div className="glass overflow-hidden rounded-3xl">
      <div className="h-52 w-full bg-slate-900">
        {p.imageUrl ? (
          <img src={p.imageUrl} alt={p.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-500 text-sm">
            No Image
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">{p.title}</h3>
            <p className="mt-2 text-sm text-slate-300/80 leading-6">{p.description}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {(p.tech || []).map((t) => (
            <span
              key={t}
              className="rounded-full border border-slate-700/60 bg-slate-900/30 px-3 py-1 text-[11px] text-slate-200/85"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
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
    <Container className="py-14">
      <SectionTitle
        eyebrow="Projects"
        title="My Work"
        subtitle="These project cards are powered by MongoDB. Use the Admin dashboard to add/update real projects."
      />

      {loading ? (
        <div className="text-sm text-slate-300/80">Loading...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {items.map((p) => (
            <ProjectCard key={p._id} p={p} />
          ))}
        </div>
      )}
    </Container>
  );
}
