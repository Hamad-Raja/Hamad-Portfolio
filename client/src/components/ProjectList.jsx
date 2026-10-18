import React, { useEffect, useState } from "react";
import { api } from "../lib/api.js";
import ProjectCard from "./ProjectCard.jsx";
import Button from "./Button.jsx";

export default function ProjectList({ featured = false }) {
  const [state, setState] = useState({ loading: true, items: [], error: false });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setState({ loading: true, items: [], error: false });
    api.get(`/api/projects${featured ? "?featured=true" : ""}`, { signal: controller.signal })
      .then(({ data }) => {
        if (!Array.isArray(data)) throw new Error("Invalid project response");
        setState({ loading: false, items: featured ? data.slice(0, 3) : data, error: false });
      })
      .catch(() => { if (!controller.signal.aborted) setState({ loading: false, items: [], error: true }); });
    return () => controller.abort();
  }, [featured, attempt]);
  if (state.loading) return <p role="status" className="rounded-lg border border-white/10 p-6 text-slate-300">Loading projects…</p>;
  if (state.error) return <div role="alert" className="rounded-lg border border-white/10 p-6 text-slate-300">
    <p className="mb-4">Projects are temporarily unavailable. Please try again in a moment.</p>
    <Button variant="ghost" onClick={() => setAttempt(a => a + 1)}>Try Again</Button>
  </div>;
  if (!state.items.length) return <p role="status" className="rounded-lg border border-white/10 p-6 text-slate-300">{featured ? "Explore the projects page for more work." : "There are no published projects to show right now."}</p>;
  return <div className={`grid gap-6 md:grid-cols-2 ${featured ? "xl:grid-cols-3" : ""}`}>{state.items.map(p => <ProjectCard key={p._id} project={p} headingLevel={featured ? "h3" : "h2"} />)}</div>;
}
