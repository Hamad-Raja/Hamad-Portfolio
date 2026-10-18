import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Container from "../components/Container.jsx";
import Button from "../components/Button.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import SocialLinks from "../components/SocialLinks.jsx";
import ProjectList from "../components/ProjectList.jsx";
import TechStack from "../components/TechStack.jsx";
import { site } from "../config/site.js";
import Services from "./Services.jsx";

export default function Home() {
  return <>
    <Container className="py-14 sm:py-20 lg:py-24">
      <div className="grid min-w-0 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(260px,320px)] xl:gap-14">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-200">Full-stack web development</p>
          <h1 className="mt-5 break-words text-4xl font-semibold leading-[1.15] tracking-tight text-white sm:text-5xl xl:text-[52px]">
            {site.name}
            <span className="mt-3 block text-[28px] font-medium leading-[1.2] text-teal-200 sm:text-4xl xl:text-[40px]">{site.role}</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300">I build modern, fast, and scalable web applications that help businesses grow. From polished interfaces to secure backend systems, I turn ideas into reliable digital products.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button as={Link} to="/contact">Let's Work Together <ArrowRight size={18} /></Button>
            <Button variant="ghost" as={Link} to="/projects">View My Projects</Button>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-5">
            {site.cvUrl && <a className="inline-flex min-h-11 items-center text-sm font-medium text-teal-200 hover:underline" href={site.cvUrl} download>Download CV</a>}
            <SocialLinks />
          </div>
        </div>
        <div className="mx-auto w-full max-w-[320px] overflow-hidden rounded-lg border border-white/10 bg-slate-900 p-2 lg:justify-self-end">
          <img src={`${import.meta.env.BASE_URL}my.jpg`} alt={site.name} width="320" height="390" fetchPriority="high" className="aspect-[32/39] w-full rounded object-cover object-center" />
        </div>
      </div>
      <section className="mt-14 rounded-lg border border-white/10 bg-white/[0.03] p-5 sm:p-6" aria-labelledby="home-stack">
        <h2 id="home-stack" className="mb-5 text-lg font-semibold text-white">Technology stack</h2>
        <TechStack />
      </section>
    </Container>
    <Services embedded />
    <Container className="pb-16">
      <SectionTitle eyebrow="Featured Work" title="Selected projects" />
      <ProjectList featured />
      <Button as={Link} to="/projects" variant="ghost" className="mt-8">View All Projects <ArrowRight size={18} /></Button>
    </Container>
  </>;
}
