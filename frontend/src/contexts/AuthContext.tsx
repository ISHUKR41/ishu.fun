/**
 * AuthContext.tsx - Authentication State Manager (Clerk + Supabase Hybrid)
 * 
 * This context wraps Clerk authentication and provides a unified auth interface
 * for the entire app. Any component can use the `useAuth()` hook to access
 * the current user, check admin status, or trigger auth actions.
 * 
 * Architecture:
 * - Clerk handles all authentication (sign in, sign up, sign out, sessions)
 * - Supabase is still used for database operations (contacts, results, etc.)
 * - Admin check uses Clerk's public metadata or falls back to Supabase RPC
 * 
 * How it works:
 * 1. ClerkProvider (in App.tsx) manages the auth session
 * 2. This context reads Clerk's user state and exposes it in a simple interface
 * 3. Components use useAuth() to get user info, admin status, etc.
 */

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useUser as useClerkUser, useAuth as useClerkAuth, useClerk } from "@clerk/clerk-react";

// Shape of the auth data available to all components
interface AuthContextType {
  user: any | null;              // Current logged-in user (null if not logged in)
  session: any | null;           // Current auth session  
  loading: boolean;              // True while checking initial auth state
  isAdmin: boolean;              // True if user has "admin" role
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, displayName?: string, phone?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

// Create the context (undefined until AuthProvider wraps the app)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider - Wraps the app and provides auth state to all children.
 * Uses Clerk's hooks internally but exposes a simple interface.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user: clerkUser, isLoaded } = useClerkUser();
  const { isSignedIn, getToken } = useClerkAuth();
  const clerk = useClerk();
  const [isAdmin, setIsAdmin] = useState(false);

  // Check admin status from Clerk's public metadata
  useEffect(() => {
    if (clerkUser) {
      // Check publicMetadata for admin role
      const role = (clerkUser.publicMetadata as any)?.role;
      setIsAdmin(role === "admin");
    } else {
      setIsAdmin(false);
    }
  }, [clerkUser]);

  /**
   * Sign in with email and password via Clerk.
   * Clerk handles this through its own UI components,
   * but this method is kept for backward compatibility.
   */
  const signIn = async (email: string, password: string) => {
    try {
      const result = await clerk.client?.signIn.create({
        identifier: email,
        password,
      });
      if (result?.status === "complete") {
        await clerk.setActive({ session: result.createdSessionId });
        return { error: null };
      }
      return { error: { message: "Sign in incomplete. Please try again." } };
    } catch (err: any) {
      return { error: { message: err?.errors?.[0]?.longMessage || err?.message || "Sign in failed" } };
    }
  };

  /**
   * Create a new account with email and password via Clerk.
   */
  const signUp = async (email: string, password: string, displayName?: string, phone?: string) => {
    try {
      const result = await clerk.client?.signUp.create({
        emailAddress: email,
        password,
        firstName: displayName?.split(" ")[0] || "",
        lastName: displayName?.split(" ").slice(1).join(" ") || "",
      });
      if (result?.status === "complete") {
        await clerk.setActive({ session: result.createdSessionId });
        return { error: null };
      }
      // If email verification is needed
      if (result?.status === "missing_requirements") {
        await result.prepareEmailAddressVerification({ strategy: "email_code" });
        return { error: { message: "Please check your email for a verification code." } };
      }
      return { error: null };
    } catch (err: any) {
      return { error: { message: err?.errors?.[0]?.longMessage || err?.message || "Sign up failed" } };
    }
  };

  /** Sign out the current user */
  const signOut = async () => {
    await clerk.signOut();
  };

  // Build a user-like object compatible with existing components
  const user = clerkUser ? {
    id: clerkUser.id,
    email: clerkUser.primaryEmailAddress?.emailAddress || "",
    user_metadata: {
      display_name: clerkUser.fullName || clerkUser.firstName || "",
      phone: clerkUser.primaryPhoneNumber?.phoneNumber || "",
    },
  } : null;

  return (
    <AuthContext.Provider value={{
      user: isSignedIn ? user : null,
      session: isSignedIn ? { user } : null,
      loading: !isLoaded,
      isAdmin,
      signIn,
      signUp,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth() - Hook to access auth state from any component.
 * Must be used inside an AuthProvider (which is inside ClerkProvider).
 * 
 * Example usage:
 *   const { user, isAdmin, signOut } = useAuth();
 *   if (!user) return <LoginPage />;
 */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
