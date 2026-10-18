import React, { useState } from "react";
import { ExternalLink, Github, Layers3 } from "lucide-react";
import Button from "./Button.jsx";
import { assetUrl, externalUrl } from "../config/site.js";

export default function ProjectCard({ project: p, headingLevel = "h2" }) {
  const [failed, setFailed] = useState(false);
  const image = assetUrl(p.imageUrl, import.meta.env.BASE_URL);
  const live = externalUrl(p.liveUrl);
  const github = externalUrl(p.githubUrl);
  const Heading = headingLevel;
  return <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] transition hover:-translate-y-1 hover:border-teal-300/40">
    <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
      {image && !failed ? <img src={image} alt={`${p.title} application screenshot`} loading="lazy" decoding="async" width="800" height="450" onError={() => setFailed(true)} className="h-full w-full object-cover" />
        : <div className="grid h-full place-items-center text-teal-200/60" aria-hidden="true"><Layers3 size={36} /></div>}
      {p.featured && <span className="absolute left-4 top-4 rounded-full border border-teal-200/20 bg-slate-950/90 px-3 py-1 text-xs text-teal-100">Featured</span>}
    </div>
    <div className="flex flex-1 flex-col p-5 sm:p-6">
      <Heading className="break-words text-xl font-semibold text-white">{p.title}</Heading>
      <p className="mt-3 whitespace-pre-line break-words text-sm leading-7 text-slate-300">{p.description}</p>
      <ul aria-label="Technologies" className="mt-5 flex flex-wrap gap-2">{(p.tech || []).map(t => <li key={t} className="break-words rounded-full border border-white/10 px-3 py-1 text-xs text-slate-200">{t}</li>)}</ul>
      {(live || github) && <div className="mt-auto flex flex-wrap gap-3 pt-6">
        {live && <Button as="a" href={live} target="_blank" rel="noopener noreferrer" aria-label={`Live demo of ${p.title}`}>Live Demo <ExternalLink size={16} /></Button>}
        {github && <Button variant="ghost" as="a" href={github} target="_blank" rel="noopener noreferrer" aria-label={`GitHub repository for ${p.title}`}>GitHub <Github size={16} /></Button>}
      </div>}
    </div>
  </article>;
}
