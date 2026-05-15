import React from "react";

export default function Button({
  as: Comp = "button",
  variant = "primary",
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-sky-400/60 disabled:opacity-60 disabled:cursor-not-allowed";

  const styles = {
    primary:
      "bg-gradient-to-r from-sky-400 via-indigo-400 to-blue-400 text-slate-950 hover:opacity-95 shadow-glow",
    ghost:
      "bg-transparent border border-slate-700/60 hover:border-sky-400/60 hover:bg-slate-900/30",
    danger:
      "bg-red-500/90 hover:bg-red-500 text-white",
  };

  return <Comp className={`${base} ${styles[variant]} ${className}`} {...props} />;
}
