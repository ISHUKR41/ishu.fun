import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 3000,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React core — cached longest, changes least often
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/")) {
            return "vendor-react";
          }
          // Routing
          if (id.includes("node_modules/react-router-dom/") || id.includes("node_modules/react-router/")) {
            return "vendor-router";
          }
          // Animation libraries (large)
          if (id.includes("node_modules/framer-motion/")) return "vendor-framer";
          if (id.includes("node_modules/gsap/")) return "vendor-gsap";
          // Three.js / 3D — only loaded on pages that use 3D scenes
          if (id.includes("node_modules/three/") || id.includes("node_modules/@react-three/")) {
            return "vendor-three";
          }
          // Particles
          if (id.includes("node_modules/@tsparticles/")) return "vendor-particles";
          // Auth
          if (id.includes("node_modules/@clerk/")) return "vendor-clerk";
          // UI components
          if (id.includes("node_modules/@radix-ui/")) return "vendor-radix";
          // PDF/document tools — very large, only needed on tool pages
          if (
            id.includes("node_modules/jspdf/") ||
            id.includes("node_modules/pdf-lib/") ||
            id.includes("node_modules/pdfjs-dist/") ||
            id.includes("node_modules/docx/") ||
            id.includes("node_modules/pptxgenjs/") ||
            id.includes("node_modules/mammoth/") ||
            id.includes("node_modules/xlsx/") ||
            id.includes("node_modules/tesseract.js/")
          ) return "vendor-docs";
          // Data / query
          if (id.includes("node_modules/@tanstack/")) return "vendor-query";
          if (id.includes("node_modules/@supabase/")) return "vendor-supabase";
        },
      },
    },
  },
}));
