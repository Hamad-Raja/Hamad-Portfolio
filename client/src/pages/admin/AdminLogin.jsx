import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../../components/Container.jsx";
import SectionTitle from "../../components/SectionTitle.jsx";
import Button from "../../components/Button.jsx";
import { api, setAuthToken } from "../../lib/api.js";
import { setToken } from "../../lib/storage.js";

export default function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const r = await api.post("/api/auth/login", { email, password });
      const token = r.data?.token;
      if (!token) throw new Error("No token");
      setToken(token);
      setAuthToken(token);
      nav("/admin/dashboard");
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container className="py-14">
      <SectionTitle
        eyebrow="Admin"
        title="Dashboard Login"
        subtitle="Use the ADMIN_EMAIL + ADMIN_PASSWORD from server .env to login."
      />

      <div className="max-w-xl glass rounded-3xl p-7">
        <form onSubmit={login} className="grid gap-4">
          <div>
            <label className="text-xs text-slate-300/80">Email</label>
            <input
              className="mt-2 w-full rounded-2xl border border-slate-800/70 bg-slate-950/40 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-400/40"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-300/80">Password</label>
            <input
              type="password"
              className="mt-2 w-full rounded-2xl border border-slate-800/70 bg-slate-950/40 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-400/40"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {err && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {err}
            </div>
          )}

          <Button disabled={loading} type="submit">
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </Container>
  );
}
