import React, { useRef, useState } from "react";
import Container from "../components/Container.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import SocialLinks from "../components/SocialLinks.jsx";
import Button from "../components/Button.jsx";
import { api } from "../lib/api.js";
import { site } from "../config/site.js";
import { Send } from "lucide-react";
const inputClass = "mt-2 w-full rounded-lg border border-white/15 bg-slate-950/50 px-4 py-3 text-sm text-white focus:border-teal-300";
const empty = { name: "", email: "", subject: "", message: "", website: "" };
export default function Contact() {
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState({ type: "", text: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const sending = useRef(false);
  function update(key, value) { setForm(s => ({ ...s, [key]: value })); }
  async function onSubmit(event) {
    event.preventDefault();
    if (sending.current) return;
    const payload = Object.fromEntries(Object.entries(form).map(([key, value]) => [key, value.trim()]));
    const issues = {};
    if (payload.name.length < 2) issues.name = "Please enter at least two characters for your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) issues.email = "Please enter a valid email address.";
    if (payload.message.length < 10) issues.message = "Please include at least ten characters about your project.";
    setErrors(issues);
    setStatus({ type: "", text: "" });
    if (Object.keys(issues).length) { document.getElementById(`contact-${Object.keys(issues)[0]}`)?.focus(); return; }
    sending.current = true;
    setLoading(true);
    try {
      await api.post("/api/contact", payload);
      setStatus({ type: "ok", text: "Thank you. Your message has been received, and I will get back to you using the email you provided." });
      setForm(empty);
    } catch (error) {
      setStatus({ type: "err", text: error.response?.status === 429
        ? "Too many messages have been sent recently. Please wait a few minutes before trying again."
        : error.response?.status === 400 ? "Please check your details and try again."
        : "Your message could not be sent. Your text has been kept so you can try again." });
    } finally { sending.current = false; setLoading(false); }
  }
  return <Container className="py-16">
    <SectionTitle as="h1" eyebrow="Contact" title="Let's Build Something Great" subtitle="Have a project in mind? Tell me about it, and let's discuss how we can bring your idea to life." />
    <div className="grid min-w-0 gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      <section className="min-w-0 rounded-lg border border-white/10 bg-white/[0.04] p-5 sm:p-7" aria-labelledby="contact-details">
        <h2 id="contact-details" className="text-xl font-semibold text-white">Start a conversation</h2>
        <p className="mt-4 text-sm leading-7 text-slate-300">Share your goals, the features you need, and any timeline you have in mind. We can work out the next steps together.</p>
        <div className="my-7 space-y-4 text-sm text-slate-200">
          {site.emailHref && <p><a href={site.emailHref} className="break-all text-teal-200 hover:underline">{site.email}</a></p>}
          {site.phoneHref && <p><a href={site.phoneHref} className="text-teal-200 hover:underline">{site.phone}</a></p>}
          {site.location && <p>{site.location}</p>}
        </div>
        <SocialLinks />
      </section>
      <form onSubmit={onSubmit} noValidate aria-busy={loading} className="min-w-0 rounded-lg border border-white/10 bg-white/[0.04] p-5 sm:p-7">
        <div className="grid gap-5 sm:grid-cols-2">
          {[['name','Name',80,'text','name'], ['email','Email',120,'email','email'], ['subject','Subject (optional)',120,'text','off']].map(([key,label,max,type,autoComplete]) =>
            <div key={key} className={key === 'subject' ? 'sm:col-span-2' : ''}>
              <label htmlFor={`contact-${key}`} className="text-sm font-medium text-slate-200">{label}</label>
              <input id={`contact-${key}`} name={key} type={type} autoComplete={autoComplete} className={inputClass} value={form[key]} maxLength={max} required={key !== 'subject'} aria-invalid={!!errors[key]} aria-describedby={errors[key] ? `${key}-error` : undefined} onChange={e => update(key, e.target.value)} />
              {errors[key] && <p id={`${key}-error`} className="mt-2 text-sm text-red-200">{errors[key]}</p>}
            </div>)}
          <div className="sm:col-span-2">
            <label htmlFor="contact-message" className="text-sm font-medium text-slate-200">Message</label>
            <textarea id="contact-message" name="message" required minLength={10} maxLength={2000} className={`${inputClass} min-h-[180px] resize-y`} value={form.message} aria-invalid={!!errors.message} aria-describedby={errors.message ? 'message-error' : undefined} onChange={e => update('message',e.target.value)} />
            {errors.message && <p id="message-error" className="mt-2 text-sm text-red-200">{errors.message}</p>}
          </div>
          <div hidden aria-hidden="true"><label htmlFor="contact-website">Website</label><input id="contact-website" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={e => update('website',e.target.value)} /></div>
          {status.text && <div role={status.type === 'err' ? 'alert' : 'status'} className={`rounded-lg border p-4 text-sm leading-6 sm:col-span-2 ${status.type === 'ok' ? 'border-teal-300/30 text-teal-100' : 'border-red-400/30 text-red-100'}`}>{status.text}</div>}
          <div className="sm:col-span-2"><Button disabled={loading} type="submit" className="w-full sm:w-auto">{loading ? 'Sending...' : 'Send Message'} <Send size={16} aria-hidden="true" /></Button></div>
        </div>
      </form>
    </div>
  </Container>;
}
