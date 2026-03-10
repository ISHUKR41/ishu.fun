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

// Clerk publishable key from environment
const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Create a React Query client for caching API responses
const queryClient = new QueryClient();

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

      {/* 404 - catches all unmatched routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

/**
 * App - Root component that wraps everything with providers.
 * Order matters: Clerk > QueryClient > Tooltip > Router > Auth
 */
const App = () => (
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
);

export default App;
