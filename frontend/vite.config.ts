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
  plugins: [
    react({
      // Use automatic JSX runtime for smaller bundle
      jsxRuntime: 'automatic',
      // Fast Refresh for better DX
      fastRefresh: true,
      // Babel plugins for optimization
      babel: {
        plugins: [
          // Remove console.log in production
          mode === 'production' && ['transform-remove-console', { exclude: ['error', 'warn'] }],
        ].filter(Boolean),
      },
    }), 
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'gsap',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-tooltip',
    ],
    exclude: ['@react-three/fiber', '@react-three/drei', 'three'],
  },
  build: {
    target: "es2020",
    cssMinify: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
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
          // Auth — don't split Clerk into its own chunk (causes React useState crash)
          // Clerk must stay in the main bundle to ensure React is available
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
