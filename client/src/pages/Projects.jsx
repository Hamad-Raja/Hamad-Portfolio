import React from "react";
import Container from "../components/Container.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import ProjectList from "../components/ProjectList.jsx";
export default function Projects() {
  return <Container className="py-16">
    <SectionTitle as="h1" eyebrow="Projects" title="My Work" subtitle="Web applications built around practical problems, thoughtful interfaces, and reliable backend systems." />
    <ProjectList />
  </Container>;
}
