import React from "react";
import Container from "./Container.jsx";

export default function Footer() {
  return (
    <div className="border-t border-white/10 bg-slate-950/60">
      <Container className="py-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="bg-gradient-to-r from-teal-200 via-sky-200 to-amber-200 bg-clip-text text-sm font-bold text-transparent">
              Hammad Zahoor
            </div>
            <div className="mt-1 text-xs text-slate-400">
              Full-Stack MERN Developer
            </div>
          </div>

          <div className="text-xs text-slate-500">
            (c) {new Date().getFullYear()} All rights reserved.
          </div>
        </div>
      </Container>
    </div>
  );
}
