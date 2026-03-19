/**
 * api.ts - Centralized API URL Configuration
 *
 * In development (Replit/local): uses "" (empty string / relative URL)
 *   → Vite proxy forwards /api/* to localhost:3001
 * In production (Vercel): uses VITE_API_URL env var or Render backend URL
 */

// In development mode, use relative URLs so Vite proxy routes them to local backend.
// In production, use the full backend URL.
export const API_URL: string = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL
  : import.meta.env.DEV
    ? ""  // relative — Vite proxy handles /api/* → localhost:3001
    : "https://ishu-site.onrender.com";
