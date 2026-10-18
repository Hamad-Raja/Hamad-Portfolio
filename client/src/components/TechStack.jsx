import React from "react";
const categories = {
  Frontend: ["React", "Next.js", "Tailwind CSS"],
  Backend: ["Node.js", "Express", "REST APIs", "JWT Auth"],
  Databases: ["MongoDB", "MySQL", "Mongoose"],
  "Tools and Deployment": ["Git / GitHub", "Deployment"],
};
export default function TechStack({ compact = false }) {
  return <div className={`grid min-w-0 gap-6 sm:grid-cols-2 ${compact ? "" : "lg:grid-cols-4"}`}>{Object.entries(categories).map(([category, skills]) =>
    <div key={category} className="min-w-0"><h3 className="mb-3 text-sm font-medium text-teal-200">{category}</h3>
      <ul className="flex flex-wrap gap-2">{skills.map(skill => <li key={skill} className="rounded-md border border-white/10 bg-slate-950/40 px-3 py-2 text-xs text-slate-200">{skill}</li>)}</ul>
    </div>)}</div>;
}
