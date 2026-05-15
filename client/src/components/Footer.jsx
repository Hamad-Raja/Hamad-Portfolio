import React from "react";
import Container from "./Container.jsx";

export default function Footer() {
  return (
    <div className="border-t border-slate-800/60">
      <Container className="py-10">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="text-sm font-semibold">Hammad Zahoor</div>
            <div className="text-xs text-slate-400">Full-Stack MERN Developer</div>
          </div>
          <div className="text-xs text-slate-500">
            © {new Date().getFullYear()} All rights reserved.
          </div>
        </div>
      </Container>
    </div>
  );
}
