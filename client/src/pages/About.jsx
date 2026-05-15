import React from "react";
import Container from "../components/Container.jsx";
import SectionTitle from "../components/SectionTitle.jsx";

const skills = [
  "React", "Node.js", "Express", "MongoDB", "Tailwind CSS",
  "REST APIs", "JWT Auth", "Mongoose", "Git/GitHub", "Deployment Basics"
];

export default function About() {
  return (
    <Container className="py-14">
      <SectionTitle
        eyebrow="About"
        title="A little about me"
        subtitle="This is professional placeholder content. Swap it with your real story anytime."
      />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="glass rounded-3xl p-7">
          <h3 className="text-lg font-semibold">My focus</h3>
          <p className="mt-3 text-sm leading-6 text-slate-300/80">
            I’m a Full-Stack MERN Developer who enjoys building clean interfaces and
            reliable backend systems. I focus on writing readable code, structuring
            projects properly, and shipping features that work smoothly in real-world usage.
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-300/80">
            I’m comfortable working across frontend and backend — from UI components,
            routing, and layouts to API design, database modeling, and authentication.
          </p>
        </div>

        <div className="glass rounded-3xl p-7">
          <h3 className="text-lg font-semibold">Skills</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {skills.map((s) => (
              <span
                key={s}
                className="rounded-full border border-slate-700/60 bg-slate-900/30 px-3 py-1 text-xs text-slate-200/90"
              >
                {s}
              </span>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-slate-800/60 bg-slate-900/25 p-4">
            <div className="text-sm font-semibold">Note</div>
            <div className="mt-1 text-xs text-slate-300/80">
              You can update skills + text in <span className="text-sky-300">src/pages/About.jsx</span>.
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
