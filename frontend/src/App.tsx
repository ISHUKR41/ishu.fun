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
import ServerStatusBanner from "@/components/common/ServerStatusBanner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useDynamicFavicon } from "@/hooks/useDynamicFavicon";
import { Component, ErrorInfo, ReactNode, lazy, Suspense } from "react";

// ─── Page Loading Spinner ─────────────────────────────────────────────────────
const PageLoader = () => (
  <div style={{
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "hsl(225, 50%, 4%)",
  }}>
    <div style={{
      width: 40,
      height: 40,
      border: "3px solid rgba(255,255,255,0.1)",
      borderTopColor: "hsl(210 100% 56%)",
      borderRadius: "50%",
      animation: "spin 0.8s linear infinite",
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

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

// Page imports - lazy loaded for performance (code splitting)
const Index = lazy(() => import("./pages/Index"));
const ResultsPage = lazy(() => import("./pages/ResultsPage"));
const ToolsPage = lazy(() => import("./pages/ToolsPage"));
const ToolPage = lazy(() => import("./pages/ToolPage"));
const NewsPage = lazy(() => import("./pages/NewsPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const TestPage = lazy(() => import("./pages/TestPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const SignInPage = lazy(() => import("./pages/SignInPage"));
const SignUpPage = lazy(() => import("./pages/SignUpPage"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const StateResultPage = lazy(() => import("./pages/StateResultPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));
const NewsArticlePage = lazy(() => import("./pages/NewsArticlePage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage"));
const BookmarksPage = lazy(() => import("./pages/BookmarksPage"));
const ExamTrackerPage = lazy(() => import("./pages/ExamTrackerPage"));
const ActivityPage = lazy(() => import("./pages/ActivityPage"));
const ToolHistoryPage = lazy(() => import("./pages/ToolHistoryPage"));
const YouTubeDownloaderPage = lazy(() => import("./pages/YouTubeDownloaderPage"));
const TeraboxDownloaderPage = lazy(() => import("./pages/TeraboxDownloaderPage"));
const UniversalVideoDownloaderPage = lazy(() => import("./pages/UniversalVideoDownloaderPage"));
const TVPage = lazy(() => import("./pages/TVPage"));
const CVPage = lazy(() => import("./pages/CVPage"));
const ResumePage = lazy(() => import("./pages/ResumePage"));
const BioDataPage = lazy(() => import("./pages/BioDataPage"));
const DashboardLayout = lazy(() => import("./components/dashboard/DashboardLayout"));

// Clerk publishable key from environment
const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Create a React Query client with sensible cache defaults to reduce redundant API calls
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,  // Data stays "fresh" for 5 minutes
      gcTime: 10 * 60 * 1000,    // Unused cache held for 10 minutes
      retry: 1,                   // Only retry failed requests once
    },
  },
});

/**
 * MissingEnvFallback - Shown when Clerk key is not configured.
 * This prevents the blank page issue when env vars are missing.
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
        variable is not set. Add it to your project Secrets (or <code style={{ background: "rgba(255,255,255,0.08)", padding: "2px 8px", borderRadius: 6, fontSize: 13 }}>.env</code> file) 
        and restart the workflow.
      </p>
      <div style={{
        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 12, padding: "16px 20px", textAlign: "left", fontSize: 13,
        color: "rgba(255,255,255,0.6)", lineHeight: 1.8,
      }}>
        <strong style={{ color: "rgba(255,255,255,0.9)" }}>Steps to fix (Replit):</strong><br/>
        1. Open the <strong style={{ color: "rgba(255,255,255,0.8)" }}>Secrets</strong> tab in your Replit project<br/>
        2. Add <code style={{ color: "#60a5fa" }}>VITE_CLERK_PUBLISHABLE_KEY</code> = your Clerk publishable key<br/>
        3. Add <code style={{ color: "#60a5fa" }}>VITE_API_URL</code> = <code style={{ color: "#34d399" }}>https://ishu-site.onrender.com</code><br/>
        4. Restart the workflow — the app will load immediately
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
    <Suspense fallback={<PageLoader />}>
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
      <Route path="/tv" element={<TVPage />} />
      <Route path="/cv" element={<CVPage />} />
      <Route path="/cv/resume" element={<ResumePage />} />
      <Route path="/cv/bio-data" element={<BioDataPage />} />
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
    </Suspense>
  );
};

/**
 * App - Root component that wraps everything with providers.
 * Shows a helpful error message if Clerk key is missing (prevents blank page).
 * Order matters: Clerk > QueryClient > Tooltip > Router > Auth
 */
const App = () => {
  // If Clerk key is missing, show a helpful error page instead of a blank screen
  if (!CLERK_KEY) {
    return <MissingEnvFallback />;
  }

  return (
    <ErrorBoundary>
      <ClerkProvider publishableKey={CLERK_KEY}>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            {/* Server status banner for cold start notifications */}
            <ServerStatusBanner />
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
