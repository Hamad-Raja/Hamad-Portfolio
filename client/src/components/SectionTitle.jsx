import React from "react";

export default function SectionTitle({ eyebrow, title, subtitle }) {
  return (
    <div className="mb-10 animate-reveal">
      {eyebrow && (
        <div className="inline-flex rounded-full border border-teal-300/20 bg-teal-300/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-teal-200">
          {eyebrow}
        </div>
      )}
      <h2 className="mt-4 max-w-3xl text-3xl font-black leading-tight text-white sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300/80">
          {subtitle}
        </p>
      )}
    </div>
  );
}
