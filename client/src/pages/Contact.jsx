import React, { useState } from "react";
import Container from "../components/Container.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import Button from "../components/Button.jsx";
import { api } from "../lib/api.js";

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
      setStatus({ type: "ok", text: "Message sent successfully ✅" });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (e2) {
      setStatus({ type: "err", text: e2?.response?.data?.message || "Failed to send message" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container className="py-14">
      <SectionTitle
        eyebrow="Contact"
        title="Let’s build something"
        subtitle="This form is connected to the backend and saves messages in MongoDB."
      />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="glass rounded-3xl p-7">
          <h3 className="text-lg font-semibold">Contact details</h3>
          <p className="mt-3 text-sm text-slate-300/80 leading-6">
            Add your email/WhatsApp later. For now, the contact form works and stores messages in the database.
          </p>

          <div className="mt-6 rounded-2xl border border-slate-800/60 bg-slate-900/25 p-4">
            <div className="text-sm font-semibold">Tip</div>
            <div className="mt-1 text-xs text-slate-300/80">
              You can view messages in <span className="text-sky-300">/admin/dashboard</span>.
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="glass rounded-3xl p-7">
          <div className="grid gap-4">
            <div>
              <label className="text-xs text-slate-300/80">Name</label>
              <input
                className="mt-2 w-full rounded-2xl border border-slate-800/70 bg-slate-950/40 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-400/40"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label className="text-xs text-slate-300/80">Email</label>
              <input
                type="email"
                className="mt-2 w-full rounded-2xl border border-slate-800/70 bg-slate-950/40 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-400/40"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="text-xs text-slate-300/80">Subject (optional)</label>
              <input
                className="mt-2 w-full rounded-2xl border border-slate-800/70 bg-slate-950/40 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-400/40"
                value={form.subject}
                onChange={(e) => update("subject", e.target.value)}
                placeholder="Project / Job / Collaboration"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300/80">Message</label>
              <textarea
                className="mt-2 min-h-[140px] w-full rounded-2xl border border-slate-800/70 bg-slate-950/40 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-400/40"
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                placeholder="Tell me about your project..."
                required
              />
            </div>

            {status.text && (
              <div
                className={`rounded-2xl border px-4 py-3 text-sm ${
                  status.type === "ok"
                    ? "border-sky-400/30 bg-sky-500/10 text-sky-200"
                    : "border-red-500/30 bg-red-500/10 text-red-200"
                }`}
              >
                {status.text}
              </div>
            )}

            <Button disabled={loading} type="submit">
              {loading ? "Sending..." : "Send Message"}
            </Button>
          </div>
        </form>
      </div>
    </Container>
  );
}
