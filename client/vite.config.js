import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { createSiteConfig } from "./src/config/site.js";
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const site = createSiteConfig(env);
  if (env.VITE_API_URL?.trim() && !site.apiUrl) throw new Error("VITE_API_URL must be an HTTP(S) origin");
  if (env.VITE_SITE_URL?.trim() && !site.siteUrl) throw new Error("VITE_SITE_URL must be an HTTP(S) origin without a path, query, or fragment");
  const title = `${site.name} | ${site.role}`;
  const description = 'Modern web applications with polished interfaces and dependable backend systems. Explore projects, services, and ways to work together.';
  return {
    plugins: [react(), {
      name: 'portfolio-metadata',
      transformIndexHtml(html) {
        const tags = [
          { tag: 'meta', attrs: { name: 'description', content: description } },
          { tag: 'meta', attrs: { property: 'og:title', content: title } },
          { tag: 'meta', attrs: { property: 'og:description', content: description } },
          { tag: 'meta', attrs: { property: 'og:type', content: 'website' } },
          { tag: 'meta', attrs: { name: 'twitter:card', content: site.siteUrl ? 'summary_large_image' : 'summary' } },
          { tag: 'meta', attrs: { name: 'twitter:title', content: title } },
          { tag: 'meta', attrs: { name: 'twitter:description', content: description } },
        ];
        if (site.siteUrl) {
          const origin = new URL(site.siteUrl).origin;
          tags.push({ tag: 'link', attrs: { rel: 'canonical', href: origin + '/' } },
            { tag: 'meta', attrs: { property: 'og:url', content: origin + '/' } },
            { tag: 'meta', attrs: { property: 'og:image', content: origin + '/my.jpg' } },
            { tag: 'meta', attrs: { property: 'og:image:alt', content: site.name } },
            { tag: 'meta', attrs: { name: 'twitter:image', content: origin + '/my.jpg' } });
        }
        return { html: html.replace(/<title>.*?<\/title>/, `<title>${escape(title)}</title>`), tags: tags.map(tag => ({ ...tag, attrs: Object.fromEntries(Object.entries(tag.attrs).map(([key, value]) => [key, escape(value)])) })) };
      },
      generateBundle() {
        let robots = 'User-agent: *\nAllow: /\nDisallow: /admin\n';
        if (site.siteUrl) {
          const origin = new URL(site.siteUrl).origin;
          robots += `Sitemap: ${origin}/sitemap.xml\n`;
          const paths = ['/', '/about', '/services', '/projects', '/contact'];
          this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(path => `<url><loc>${escape(origin + path)}</loc></url>`).join('')}</urlset>` });
        }
        this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots });
      },
    }],
    server: { port: 5173, proxy: { '/api': 'http://localhost:5000' } },
  };
});
