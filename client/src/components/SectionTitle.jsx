import React from "react";
export default function SectionTitle({ eyebrow, title, subtitle, as: Heading = "h2" }) {
  return <div className="mb-10">
    {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-200">{eyebrow}</p>}
    <Heading className="mt-3 max-w-3xl break-words text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl">{title}</Heading>
    {subtitle && <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">{subtitle}</p>}
  </div>;
}
