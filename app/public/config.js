/**
 * Djanam Menu — API Configuration
 *
 * The frontend reads the API base URL at runtime from `window.__DJANAM_API_URL__`
 * (this file), NOT from a build-time env variable. Edit + save + refresh to change it.
 *
 * Default (recommended): same-domain via the Vercel rewrite/proxy. The static
 * frontend on https://djanam-menu.vercel.app forwards `/menu/api/*` to the
 * Railway backend, so no CORS is involved and the value below works as-is.
 *
 * Optional: point directly at the external Railway backend. The backend has
 * CORS enabled, so a cross-origin URL is supported — just uncomment the second
 * line and set your Railway URL.
 */

// Default — same-domain through the Vercel rewrite:
window.__DJANAM_API_URL__ = "/menu/api/trpc";

// Optional — external backend directly (Railway/Render, CORS enabled):
// window.__DJANAM_API_URL__ = "https://YOUR-PROJECT.up.railway.app/api/trpc";
