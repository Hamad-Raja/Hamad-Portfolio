import React from "react";

export default function SectionTitle({ eyebrow, title, subtitle }) {
  return (
    <div className="mb-10 animate-reveal">
      {eyebrow && (
        <div className="inline-flex rounded-full border border-teal-300/20 bg-teal-300/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-teal-200">
          {eyebrow}
        </div>
      )}
      <h2 className="mt-4 max-w-3xl break-words text-3xl font-extrabold leading-tight text-white sm:text-4xl">
        <span className="bg-[linear-gradient(110deg,#f8fafc,#ccfbf1_42%,#38bdf8_72%,#fbbf24)] bg-clip-text text-transparent">
          {title}
        </span>
      </h2>
      <div className="mt-4 h-px w-24 rounded-full bg-gradient-to-r from-teal-300 via-sky-300 to-transparent" />
      {subtitle && (
        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300/80">
          {subtitle}
        </p>
      )}
    </div>
  );
}
