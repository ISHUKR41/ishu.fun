/**
 * App.tsx - Main Application Entry Point
 * 
 * This is the root component of ISHU — Indian StudentHub University.
 * It sets up all the global providers (Clerk Auth, React Query, Tooltips)
 * and defines all the page routes for the entire application.
 * 
 * Structure:
 * - ClerkProvider: Handles user authentication (sign in, sign up, sessions)
 * - QueryClientProvider: Handles server-state caching (API calls)
 * - TooltipProvider: Enables tooltips across the app
 * - Toaster/Sonner: Toast notification systems
 * - BrowserRouter: Enables client-side routing
 * - AuthProvider: Bridges Clerk auth state to app components
 */

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useDynamicFavicon } from "@/hooks/useDynamicFavicon";
import { Component, ErrorInfo, ReactNode } from "react";

// Error Boundary Component
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[v0] React Error Boundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "hsl(225, 50%, 4%)",
          color: "white",
          fontFamily: "'Inter', system-ui, sans-serif",
          padding: "2rem",
        }}>
          <div style={{ maxWidth: 520, textAlign: "center" }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
              Something went wrong
            </h1>
            <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: 16 }}>
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: "hsl(210 100% 56%)",
                color: "white",
                padding: "12px 24px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontWeight: 600
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Page imports - each page is a separate component
import Index from "./pages/Index";
import ResultsPage from "./pages/ResultsPage";
import ToolsPage from "./pages/ToolsPage";
import ToolPage from "./pages/ToolPage";
import NewsPage from "./pages/NewsPage";
import BlogPage from "./pages/BlogPage";
import ContactPage from "./pages/ContactPage";
import TestPage from "./pages/TestPage";
import AboutPage from "./pages/AboutPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import AdminPanel from "./pages/AdminPanel";
import StateResultPage from "./pages/StateResultPage";
import NotFound from "./pages/NotFound";
import BlogPostPage from "./pages/BlogPostPage";
import NewsArticlePage from "./pages/NewsArticlePage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import NotificationsPage from "./pages/NotificationsPage";
import BookmarksPage from "./pages/BookmarksPage";
import ExamTrackerPage from "./pages/ExamTrackerPage";
import ActivityPage from "./pages/ActivityPage";
import ToolHistoryPage from "./pages/ToolHistoryPage";
import YouTubeDownloaderPage from "./pages/YouTubeDownloaderPage";
import TeraboxDownloaderPage from "./pages/TeraboxDownloaderPage";
import UniversalVideoDownloaderPage from "./pages/UniversalVideoDownloaderPage";
import DashboardLayout from "./components/dashboard/DashboardLayout";

// Clerk publishable key from environment
const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

console.log("[v0] CLERK_KEY present:", !!CLERK_KEY);

// Create a React Query client for caching API responses
const queryClient = new QueryClient();

/**
 * MissingEnvFallback - Shown when Clerk key is not configured.
 * This prevents the blank page issue on Vercel when env vars are missing.
 */
const MissingEnvFallback = () => (
  <div style={{
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "hsl(225, 50%, 4%)",
    color: "white",
    fontFamily: "'Inter', system-ui, sans-serif",
    padding: "2rem",
  }}>
    <div style={{ maxWidth: 520, textAlign: "center" }}>
      <div style={{
        width: 64, height: 64, borderRadius: 16,
        background: "linear-gradient(135deg, hsl(217,91%,55%), hsl(260,100%,65%))",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 1.5rem", fontSize: 28,
      }}>⚠️</div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
        Configuration Required
      </h1>
      <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: 24, fontSize: 15 }}>
        The <code style={{ background: "rgba(255,255,255,0.08)", padding: "2px 8px", borderRadius: 6, fontSize: 13 }}>VITE_CLERK_PUBLISHABLE_KEY</code> environment 
        variable is not set. Please add it to your Vercel project settings or <code style={{ background: "rgba(255,255,255,0.08)", padding: "2px 8px", borderRadius: 6, fontSize: 13 }}>.env</code> file 
        and redeploy.
      </p>
      <div style={{
        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 12, padding: "16px 20px", textAlign: "left", fontSize: 13,
        color: "rgba(255,255,255,0.6)", lineHeight: 1.8,
      }}>
        <strong style={{ color: "rgba(255,255,255,0.9)" }}>Steps to fix:</strong><br/>
        1. Go to Vercel Dashboard → Settings → Environment Variables<br/>
        2. Add <code style={{ color: "#60a5fa" }}>VITE_CLERK_PUBLISHABLE_KEY</code> = your Clerk key<br/>
        3. Add <code style={{ color: "#60a5fa" }}>VITE_API_URL</code> = your backend URL<br/>
        4. Redeploy the project
      </div>
    </div>
  </div>
);

/**
 * AppContent - Contains route definitions and dynamic favicon logic.
 * Separated from App so it can use hooks that require Router context.
 */
const AppContent = () => {
  // Changes the browser tab favicon and title based on current page
  useDynamicFavicon();

  return (
    <Routes>
      {/* Public pages - accessible to everyone */}
      <Route path="/" element={<Index />} />
      <Route path="/results" element={<ResultsPage />} />
      <Route path="/tools" element={<ToolsPage />} />
      <Route path="/tools/youtube-downloader" element={<YouTubeDownloaderPage />} />
      <Route path="/tools/terabox-downloader" element={<TeraboxDownloaderPage />} />
      <Route path="/tools/universal-video-downloader" element={<UniversalVideoDownloaderPage />} />
      <Route path="/tools/:toolSlug" element={<ToolPage />} />
      <Route path="/news" element={<NewsPage />} />
      <Route path="/news/:newsSlug" element={<NewsArticlePage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:blogSlug" element={<BlogPostPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/test" element={<TestPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/results/state/:stateSlug" element={<StateResultPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />

      {/* Auth pages - login and registration */}
      <Route path="/auth/signin" element={<SignInPage />} />
      <Route path="/auth/signup" element={<SignUpPage />} />

      {/* Admin pages - only accessible to admin users */}
      <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPanel /></ProtectedRoute>} />
      <Route path="/admin/*" element={<ProtectedRoute adminOnly><AdminPanel /></ProtectedRoute>} />

      {/* Dashboard pages - protected routes with dashboard layout */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><DashboardPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><DashboardLayout><ProfilePage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><DashboardLayout><SettingsPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><DashboardLayout><NotificationsPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/saved" element={<ProtectedRoute><DashboardLayout><BookmarksPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/tracker" element={<ProtectedRoute><DashboardLayout><ExamTrackerPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/activity" element={<ProtectedRoute><DashboardLayout><ActivityPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/tools/history" element={<ProtectedRoute><DashboardLayout><ToolHistoryPage /></DashboardLayout></ProtectedRoute>} />

      {/* 404 - catches all unmatched routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

/**
 * App - Root component that wraps everything with providers.
 * Shows a helpful error message if Clerk key is missing (prevents blank page).
 * Order matters: Clerk > QueryClient > Tooltip > Router > Auth
 */
const App = () => {
  console.log("[v0] App component rendering");
  
  // If Clerk key is missing, show a helpful error page instead of a blank screen
  if (!CLERK_KEY) {
    console.log("[v0] Clerk key missing, showing fallback");
    return <MissingEnvFallback />;
  }
  
  console.log("[v0] Clerk key present, rendering full app");

  return (
    <ErrorBoundary>
      <ClerkProvider publishableKey={CLERK_KEY}>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            {/* Two toast systems for different notification styles */}
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AuthProvider>
                <AppContent />
              </AuthProvider>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </ClerkProvider>
    </ErrorBoundary>
  );
};

export default App;
