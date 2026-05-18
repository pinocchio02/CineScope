/**
 * API base URL for backend requests.
 * - Local dev: unset → "/api" (Vite proxies to http://127.0.0.1:8000)
 * - Production: set VITE_API_URL to your Render URL (no trailing slash), e.g. https://cinescope-21yg.onrender.com
 */
const rawBase = import.meta.env.VITE_API_URL?.trim() ?? "";
export const API_BASE = rawBase ? rawBase.replace(/\/$/, "") : "/api";

export function apiUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${normalized}`;
}
