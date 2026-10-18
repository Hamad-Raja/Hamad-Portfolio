import React from "react";

const sizes = {
  sm: "text-xl",
  md: "text-2xl",
};

export default function PanelHeading({ children, size = "md", className = "", as: Heading = "h2" }) {
  return (
    <div className={`min-w-0 ${className}`}>
      <Heading
        className={`break-words ${sizes[size] || sizes.md} font-semibold leading-tight text-white`}
      >
        {children}
      </Heading>
      <div className="mt-3 h-px w-16 rounded-full bg-gradient-to-r from-teal-300 via-sky-300 to-transparent" />
    </div>
  );
}
