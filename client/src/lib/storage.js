const KEY = "portfolio_admin_token";
// Remove the previous persistent session. A new login is required after migration.
try { localStorage.removeItem(KEY); } catch { /* storage may be unavailable */ }
export function clearToken() { try { sessionStorage.removeItem(KEY); } catch { /* no session */ } }
export function getToken() {
  try {
    const token = sessionStorage.getItem(KEY) || "";
    if (!token) return "";
    const claims = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (!claims.exp || claims.exp * 1000 <= Date.now()) { clearToken(); return ""; }
    return token;
  } catch { clearToken(); return ""; }
}
export function setToken(token) { sessionStorage.setItem(KEY, token); }
