import React, { useState } from "react";
import Container from "../components/Container.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import Button from "../components/Button.jsx";
import { api } from "../lib/api.js";
import { Mail, MessageSquare, Send, Sparkles } from "lucide-react";

const inputClass =
  "mt-2 w-full rounded-lg border border-white/10 bg-slate-950/45 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-teal-300/50 focus:bg-slate-950/65 focus:ring-2 focus:ring-teal-300/20";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  function update(key, value) {
    setForm((s) => ({ ...s, [key]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setStatus({ type: "", text: "" });
    setLoading(true);
    try {
      await api.post("/api/contact", form);
      setStatus({ type: "ok", text: "Message sent successfully." });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (e2) {
      setStatus({ type: "err", text: e2?.response?.data?.message || "Failed to send message" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container className="py-16">
      <SectionTitle
        eyebrow="Contact"
        title="Let's build something polished"
        subtitle="Send a project, job, or collaboration message. The form still saves directly through your existing backend."
      />

      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.055] p-7 shadow-soft backdrop-blur-2xl animate-reveal">
          <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-teal-300/20 blur-3xl animate-pulse-glow" />
          <div className="relative">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-teal-300 to-sky-400 text-slate-950 shadow-glow">
              <MessageSquare size={22} />
            </div>
            <h3 className="mt-5 text-2xl font-black text-white">Contact details</h3>
            <p className="mt-4 text-sm leading-7 text-slate-300/85">
              Share what you want to build and I will respond with a clear next
              step. For portfolio demos, submitted messages are available in the
              admin dashboard.
            </p>

            <div className="mt-7 grid gap-3">
              <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-slate-950/40 p-4">
                <Mail size={18} className="text-teal-200" />
                <div>
                  <div className="text-xs text-slate-400">Email</div>
                  <div className="text-sm font-semibold text-white">Add your email here</div>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-slate-950/40 p-4">
                <Sparkles size={18} className="text-amber-200" />
                <div>
                  <div className="text-xs text-slate-400">Response</div>
                  <div className="text-sm font-semibold text-white">Available for MERN work</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-lg border border-white/10 bg-white/[0.055] p-7 shadow-soft backdrop-blur-2xl animate-reveal [animation-delay:120ms]"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Name
              </label>
              <input
                className={inputClass}
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Email
              </label>
              <input
                type="email"
                className={inputClass}
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Subject
              </label>
              <input
                className={inputClass}
                value={form.subject}
                onChange={(e) => update("subject", e.target.value)}
                placeholder="Project / Job / Collaboration"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Message
              </label>
              <textarea
                className={`${inputClass} min-h-[160px] resize-none`}
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                placeholder="Tell me about your project..."
                required
              />
            </div>

            {status.text && (
              <div
                className={`sm:col-span-2 rounded-lg border px-4 py-3 text-sm ${
                  status.type === "ok"
                    ? "border-teal-300/30 bg-teal-300/10 text-teal-100"
                    : "border-red-400/30 bg-red-500/10 text-red-100"
                }`}
              >
                {status.text}
              </div>
            )}

            <div className="sm:col-span-2">
              <Button disabled={loading} type="submit" className="w-full sm:w-auto">
                {loading ? "Sending..." : "Send Message"} <Send size={16} />
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Container>
  );
}
