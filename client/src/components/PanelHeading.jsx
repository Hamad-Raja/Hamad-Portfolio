import React from "react";

const sizes = {
  sm: "text-xl",
  md: "text-2xl",
};

export default function PanelHeading({ children, size = "md", className = "" }) {
  return (
    <div className={`min-w-0 ${className}`}>
      <h3
        className={`break-words ${sizes[size] || sizes.md} font-extrabold leading-tight text-white`}
      >
        <span className="bg-[linear-gradient(110deg,#f8fafc,#ccfbf1_44%,#7dd3fc_74%,#fef3c7)] bg-clip-text text-transparent">
          {children}
        </span>
      </h3>
      <div className="mt-3 h-px w-16 rounded-full bg-gradient-to-r from-teal-300 via-sky-300 to-transparent" />
    </div>
  );
}
