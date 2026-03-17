/**
 * main.tsx - Application Entry Point
 * 
 * This is the very first file that runs when the app starts.
 * It mounts the React application into the HTML #root element.
 */

import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";  // Global styles (Tailwind, custom CSS, theme tokens)

console.log("[v0] main.tsx loaded");

// Mount the entire React app into the #root div in index.html
const rootElement = document.getElementById("root");
console.log("[v0] Root element found:", !!rootElement);

if (rootElement) {
  createRoot(rootElement).render(
    <HelmetProvider>
      <App />
    </HelmetProvider>
  );
  console.log("[v0] App rendered to root");
}else {
  console.error("[v0] Root element not found!");
}
