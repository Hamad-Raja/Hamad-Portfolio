import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../../components/Container.jsx";
import SectionTitle from "../../components/SectionTitle.jsx";
import Button from "../../components/Button.jsx";
import { api, setAuthToken } from "../../lib/api.js";
import { setToken } from "../../lib/storage.js";

const inputClass =
  "mt-2 w-full rounded-lg border border-white/10 bg-slate-950/45 px-4 py-3 text-sm outline-none transition focus:border-teal-300/50 focus:ring-2 focus:ring-teal-300/20";

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
    <Container className="py-16">
      <SectionTitle
        eyebrow="Admin"
        title="Dashboard Login"
        subtitle="Use the ADMIN_EMAIL + ADMIN_PASSWORD from server .env to login."
      />

      <div className="max-w-xl rounded-lg border border-white/10 bg-white/[0.055] p-7 shadow-soft backdrop-blur-2xl">
        <form onSubmit={login} className="grid gap-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Email
            </label>
            <input
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Password
            </label>
            <input
              type="password"
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>

          {err && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
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
