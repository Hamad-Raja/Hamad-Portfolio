const trim = value => typeof value === "string" ? value.trim() : "";

export function externalUrl(value) {
  const input = trim(value);
  if (!/^https?:\/\//i.test(input)) return null;
  try {
    const url = new URL(input);
    return url.hostname && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}

export function assetUrl(value, base = "/") {
  const input = trim(value);
  if (input.startsWith("/") && !input.startsWith("//") && !/[\\\s?#]/.test(input)) return `${base.replace(/\/$/, "")}${input}`;
  return externalUrl(input);
}

function publicOrigin(value) {
  const safe = externalUrl(value);
  if (!safe) return null;
  const url = new URL(safe);
  return url.pathname === "/" && !url.search && !url.hash ? url.origin : null;
}

export function createSiteConfig(env = {}) {
  const email = trim(env.VITE_CONTACT_EMAIL);
  const phone = trim(env.VITE_CONTACT_PHONE);
  const validEmail = /^[^\s@<>?&#]+@[^\s@<>?&#]+\.[^\s@<>?&#]+$/.test(email) ? email : null;
  const validPhone = /^\+?[\d ()-]{7,25}$/.test(phone) && phone.replace(/\D/g, "").length >= 7 ? phone : null;
  const socialKeys = ["github", "linkedin", "twitter", "facebook", "instagram", "whatsapp", "upwork", "fiverr"];
  return Object.freeze({
    name: trim(env.VITE_PORTFOLIO_NAME) || "Hammad Zahoor",
    role: trim(env.VITE_PORTFOLIO_ROLE) || "Full-Stack Developer",
    apiUrl: publicOrigin(env.VITE_API_URL) || "",
    siteUrl: publicOrigin(env.VITE_SITE_URL),
    email: validEmail, emailHref: validEmail ? `mailto:${validEmail}` : null,
    phone: validPhone, phoneHref: validPhone ? `tel:${validPhone.replace(/[^+\d]/g, "")}` : null,
    location: trim(env.VITE_CONTACT_LOCATION) || null,
    cvUrl: assetUrl(env.VITE_CV_URL === undefined ? "/CV.pdf" : env.VITE_CV_URL, env.BASE_URL || "/"),
    social: Object.fromEntries(socialKeys.map(key => [key, externalUrl(env[`VITE_${key.toUpperCase()}_URL`])])),
  });
}

export const site = createSiteConfig(import.meta.env);
