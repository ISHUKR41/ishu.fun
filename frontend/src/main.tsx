/**
 * main.tsx - Application Entry Point
 * 
 * This is the very first file that runs when the app starts.
 * It mounts the React application into the HTML #root element.
 */

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";  // Global styles (Tailwind, custom CSS, theme tokens)

// Mount the entire React app into the #root div in index.html
const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(<App />);
}
