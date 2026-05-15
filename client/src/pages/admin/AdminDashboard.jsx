import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../../components/Container.jsx";
import SectionTitle from "../../components/SectionTitle.jsx";
import Button from "../../components/Button.jsx";
import { api, setAuthToken } from "../../lib/api.js";
import { clearToken, getToken } from "../../lib/storage.js";
import { Plus, Trash2, Pencil, LogOut, RefreshCw } from "lucide-react";

function Field({ label, value, onChange, placeholder = "", type = "text" }) {
  return (
    <div>
      <label className="text-xs text-slate-300/80">{label}</label>
      <input
        type={type}
        className="mt-2 w-full rounded-2xl border border-slate-800/70 bg-slate-950/40 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-400/40"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
     <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass rounded-3xl p-6">
        <div className="flex items-center justify-between">
          <div className="text-base font-semibold">{title}</div>
          <button
            className="rounded-xl border border-slate-800/70 px-3 py-2 text-sm"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const nav = useNavigate();
  const [tab, setTab] = useState("projects");
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [busy, setBusy] = useState(false);

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    tech: "React,Node,Express,MongoDB,Tailwind",
    imageUrl: "",
    liveUrl: "",
    githubUrl: "",
    featured: false,
    order: 0,
  });

  const token = useMemo(() => getToken(), []);

  useEffect(() => {
    setAuthToken(token);
    refreshAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function refreshAll() {
    setBusy(true);
    try {
      const [p, m] = await Promise.all([
        api.get("/api/projects"),
        api.get("/api/messages"),
      ]);
      setProjects(p.data || []);
      setMessages(m.data || []);
    } catch (e) {
      // token expired or unauthorized
    } finally {
      setBusy(false);
    }
  }

  function logout() {
    clearToken();
    setAuthToken("");
    nav("/admin");
  }

  function startCreate() {
    setEditId("");
    setForm({
      title: "",
      description: "",
      tech: "React,Node,Express,MongoDB,Tailwind",
      imageUrl: "",
      liveUrl: "",
      githubUrl: "",
      featured: false,
      order: 0,
    });
    setOpen(true);
  }

  function startEdit(p) {
    setEditId(p._id);
    setForm({
      title: p.title || "",
      description: p.description || "",
      tech: (p.tech || []).join(","),
      imageUrl: p.imageUrl || "",
      liveUrl: p.liveUrl || "",
      githubUrl: p.githubUrl || "",
      featured: !!p.featured,
      order: Number(p.order || 0),
    });
    setOpen(true);
  }

  async function saveProject() {
    if (!form.title.trim() || !form.description.trim()) return;
    setBusy(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        tech: form.tech.split(",").map((t) => t.trim()).filter(Boolean),
        imageUrl: form.imageUrl.trim(),
        liveUrl: form.liveUrl.trim(),
        githubUrl: form.githubUrl.trim(),
        featured: !!form.featured,
        order: Number(form.order || 0),
      };

      if (editId) await api.put(`/api/projects/${editId}`, payload);
      else await api.post("/api/projects", payload);

      setOpen(false);
      await refreshAll();
    } finally {
      setBusy(false);
    }
  }

  async function deleteProject(id) {
    if (!confirm("Delete this project?")) return;
    setBusy(true);
    try {
      await api.delete(`/api/projects/${id}`);
      await refreshAll();
    } finally {
      setBusy(false);
    }
  }

  async function deleteMessage(id) {
    if (!confirm("Delete this message?")) return;
    setBusy(true);
    try {
      await api.delete(`/api/messages/${id}`);
      await refreshAll();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Container className="py-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <SectionTitle eyebrow="Admin" title="Dashboard" subtitle="Manage projects and contact messages." />
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={refreshAll} disabled={busy}>
            <RefreshCw size={16} /> Refresh
          </Button>
          <Button variant="ghost" onClick={logout}>
            <LogOut size={16} /> Logout
          </Button>
        </div>
      </div>

      <div className="mt-2 flex gap-3">
        <button
          onClick={() => setTab("projects")}
          className={`rounded-2xl border px-4 py-2 text-sm ${
            tab === "projects"
              ? "border-sky-400/40 bg-sky-500/10 text-sky-200"
              : "border-slate-800/70 bg-slate-900/20 text-slate-200/80"
          }`}
        >
          Projects
        </button>
        <button
          onClick={() => setTab("messages")}
          className={`rounded-2xl border px-4 py-2 text-sm ${
            tab === "messages"
              ? "border-sky-400/40 bg-sky-500/10 text-sky-200"
              : "border-slate-800/70 bg-slate-900/20 text-slate-200/80"
          }`}
        >
          Messages
        </button>
      </div>

      {tab === "projects" && (
        <div className="mt-6">
          <div className="flex items-center justify-between gap-4">
            <div className="text-sm text-slate-300/80">
              Total: <span className="text-slate-100 font-semibold">{projects.length}</span>
            </div>
            <Button onClick={startCreate}>
              <Plus size={16} /> New Project
            </Button>
          </div>

          <div className="mt-4 grid gap-4">
            {projects.map((p) => (
              <div key={p._id} className="glass rounded-3xl p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="text-base font-semibold">{p.title}</div>
                    <div className="mt-1 text-xs text-slate-400">
                      Featured: {p.featured ? "Yes" : "No"} • Order: {p.order ?? 0}
                    </div>
                    <div className="mt-2 text-sm text-slate-300/80 line-clamp-2">
                      {p.description}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(p.tech || []).slice(0, 6).map((t) => (
                        <span key={t} className="rounded-full border border-slate-700/60 bg-slate-900/30 px-3 py-1 text-[11px] text-slate-200/85">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => startEdit(p)}>
                      <Pencil size={16} /> Edit
                    </Button>
                    <Button variant="danger" onClick={() => deleteProject(p._id)}>
                      <Trash2 size={16} /> Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "messages" && (
        <div className="mt-6">
          <div className="text-sm text-slate-300/80">
            Total: <span className="text-slate-100 font-semibold">{messages.length}</span>
          </div>

          <div className="mt-4 grid gap-4">
            {messages.map((m) => (
              <div key={m._id} className="glass rounded-3xl p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="text-base font-semibold">{m.name} <span className="text-xs text-slate-400">({m.email})</span></div>
                    <div className="mt-1 text-xs text-slate-400">
                      {new Date(m.createdAt).toLocaleString()} • {m.subject || "No subject"}
                    </div>
                    <div className="mt-3 text-sm text-slate-300/80 whitespace-pre-wrap">{m.message}</div>
                  </div>
                  <Button variant="danger" onClick={() => deleteMessage(m._id)}>
                    <Trash2 size={16} /> Delete
                  </Button>
                </div>
              </div>
            ))}
            {!messages.length && (
              <div className="text-sm text-slate-300/80">No messages yet.</div>
            )}
          </div>
        </div>
      )}

      <Modal
        open={open}
        title={editId ? "Edit Project" : "Create Project"}
        onClose={() => setOpen(false)}
      >
        <div className="grid gap-4">
          <Field label="Title" value={form.title} onChange={(v) => setForm((s) => ({ ...s, title: v }))} />
          <div>
            <label className="text-xs text-slate-300/80">Description</label>
            <textarea
              className="mt-2 min-h-[120px] w-full rounded-2xl border border-slate-800/70 bg-slate-950/40 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-400/40"
              value={form.description}
              onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
              placeholder="Short project summary..."
            />
          </div>
          <Field
            label="Tech (comma separated)"
            value={form.tech}
            onChange={(v) => setForm((s) => ({ ...s, tech: v }))}
            placeholder="React, Node, Express, MongoDB"
          />
          <Field label="Image URL" value={form.imageUrl} onChange={(v) => setForm((s) => ({ ...s, imageUrl: v }))} placeholder="https://..." />
          <Field label="Live URL" value={form.liveUrl} onChange={(v) => setForm((s) => ({ ...s, liveUrl: v }))} placeholder="https://..." />
          <Field label="GitHub URL" value={form.githubUrl} onChange={(v) => setForm((s) => ({ ...s, githubUrl: v }))} placeholder="https://github.com/..." />

          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-slate-200/85">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm((s) => ({ ...s, featured: e.target.checked }))}
              />
              Featured
            </label>
            <div className="w-40">
              <Field
                label="Order"
                type="number"
                value={form.order}
                onChange={(v) => setForm((s) => ({ ...s, order: v }))}
              />
            </div>
          </div>

          <div className="mt-2 flex gap-3">
            <Button onClick={saveProject} disabled={busy}>
              {busy ? "Saving..." : "Save"}
            </Button>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </Container>
  );
}
