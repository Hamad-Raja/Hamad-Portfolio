import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { site } from "../config/site.js";
const pages = {
  "/": ["", "Modern web applications with polished interfaces and dependable backend systems."],
  "/about": ["About", "Learn about my approach to frontend development, backend APIs, and maintainable web applications."],
  "/services": ["Services", "Frontend development, backend development, full-stack applications, and API and database integration."],
  "/projects": ["Projects", "Explore web applications, their technology stacks, features, and source code."],
  "/contact": ["Contact", "Have a project in mind? Get in touch to discuss your next web application."],
};
export default function PageMetadata() {
  const { pathname } = useLocation();
  useEffect(() => {
    const admin = pathname.startsWith("/admin");
    const [label, description] = pages[pathname] || ["Admin", "Portfolio administration."];
    const title = `${label ? `${label} | ` : ""}${site.name} | ${site.role}`;
    document.title = title;
    const meta = (key, value, property = false) => {
      const attr = property ? "property" : "name";
      let element = document.head.querySelector(`meta[${attr}="${key}"]`);
      if (!element) { element = document.createElement("meta"); element.setAttribute(attr, key); document.head.append(element); }
      element.content = value;
    };
    meta("description", description);
    meta("og:title", title, true);
    meta("og:description", description, true);
    meta("twitter:title", title);
    meta("twitter:description", description);
    meta("robots", admin ? "noindex, nofollow" : "index, follow");
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (site.siteUrl && !admin) {
      const url = new URL(pathname, site.siteUrl).href;
      if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.append(canonical); }
      canonical.href = url;
      meta("og:url", url, true);
    } else {
      canonical?.remove();
      document.head.querySelector('meta[property="og:url"]')?.remove();
    }
  }, [pathname]);
  return null;
}
