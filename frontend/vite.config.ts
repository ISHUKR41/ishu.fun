import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 5000,
    allowedHosts: true,
    hmr: {
      overlay: false,
    },
    // Proxy /api/* to local backend in development
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
        timeout: 300000,
      },
    },
  },
  plugins: [
    react({
      jsxRuntime: 'automatic',
      fastRefresh: true,
      babel: {
        plugins: [
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
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'gsap',
      'hls.js',
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
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/")) {
            return "vendor-react";
          }
          if (id.includes("node_modules/react-router-dom/") || id.includes("node_modules/react-router/")) {
            return "vendor-router";
          }
          if (id.includes("node_modules/framer-motion/")) return "vendor-framer";
          if (id.includes("node_modules/gsap/")) return "vendor-gsap";
          if (id.includes("node_modules/three/") || id.includes("node_modules/@react-three/")) {
            return "vendor-three";
          }
          if (id.includes("node_modules/@tsparticles/")) return "vendor-particles";
          if (id.includes("node_modules/@radix-ui/")) return "vendor-radix";
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
          if (id.includes("node_modules/@tanstack/")) return "vendor-query";
          if (id.includes("node_modules/@supabase/")) return "vendor-supabase";
        },
      },
    },
  },
}));
