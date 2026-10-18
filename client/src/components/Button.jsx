import React from "react";

export default function Button({
  as: Comp = "button",
  variant = "primary",
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 min-h-11 rounded-full px-5 py-2.5 text-sm font-semibold transition duration-300 focus:outline-none focus:ring-2 focus:ring-teal-300/60 disabled:cursor-not-allowed disabled:opacity-60";

  const styles = {
    primary:
      "bg-teal-300 text-slate-950 hover:-translate-y-0.5 hover:bg-teal-200",
    ghost:
      "border border-white/10 bg-white/[0.04] text-slate-100 backdrop-blur-xl hover:-translate-y-0.5 hover:border-teal-300/50 hover:bg-teal-300/10",
    danger:
      "bg-red-500/90 text-white hover:-translate-y-0.5 hover:bg-red-500",
  };

  return <Comp className={`${base} ${styles[variant]} ${className}`} {...props} />;
}
