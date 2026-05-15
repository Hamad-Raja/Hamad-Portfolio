import React from "react";

export default function SectionTitle({ eyebrow, title, subtitle }) {
  return (
    <div className="mb-8">
      {eyebrow && (
        <div className="text-xs font-semibold uppercase tracking-widest text-sky-300/90">
          {eyebrow}
        </div>
      )}
      <h2 className="mt-2 text-2xl font-bold sm:text-3xl">{title}</h2>
      {subtitle && <p className="mt-2 max-w-2xl text-sm text-slate-300/80">{subtitle}</p>}
    </div>
  );
}
