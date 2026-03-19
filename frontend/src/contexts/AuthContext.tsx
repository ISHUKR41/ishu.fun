/**
 * AuthContext.tsx - Authentication State Manager
 * 
 * Provides auth state via two providers:
 * - AuthProvider: Clerk-backed (used when VITE_CLERK_PUBLISHABLE_KEY is set)
 * - NoAuthProvider: No-op fallback (used when Clerk key is missing)
 * 
 * Both implement the same AuthContextType so all components work unchanged.
 */

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { useUser as useClerkUser, useAuth as useClerkAuth, useClerk } from "@clerk/clerk-react";

interface AuthContextType {
  user: any | null;
  session: any | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, displayName?: string, phone?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider - Must be placed inside ClerkProvider.
 * Used only when VITE_CLERK_PUBLISHABLE_KEY is set.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user: clerkUser, isLoaded } = useClerkUser();
  const { isSignedIn } = useClerkAuth();
  const clerk = useClerk();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (clerkUser) {
      const role = (clerkUser.publicMetadata as any)?.role;
      setIsAdmin(role === "admin");
    } else {
      setIsAdmin(false);
    }
  }, [clerkUser]);

  const signIn = async (email: string, password: string) => {
    try {
      const result = await clerk.client?.signIn.create({ identifier: email, password });
      if (result?.status === "complete") {
        await clerk.setActive({ session: result.createdSessionId });
        return { error: null };
      }
      return { error: { message: "Sign in incomplete. Please try again." } };
    } catch (err: any) {
      return { error: { message: err?.errors?.[0]?.longMessage || err?.message || "Sign in failed" } };
    }
  };

  const signUp = async (email: string, password: string, displayName?: string, _phone?: string) => {
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
      if (result?.status === "missing_requirements") {
        await result.prepareEmailAddressVerification({ strategy: "email_code" });
        return { error: { message: "Please check your email for a verification code." } };
      }
      return { error: null };
    } catch (err: any) {
      return { error: { message: err?.errors?.[0]?.longMessage || err?.message || "Sign up failed" } };
    }
  };

  const signOut = async () => { await clerk.signOut(); };

  const user = useMemo(() => {
    if (!clerkUser) return null;
    return {
      id: clerkUser.id,
      email: clerkUser.primaryEmailAddress?.emailAddress || "",
      user_metadata: {
        display_name: clerkUser.fullName || clerkUser.firstName || "",
        phone: clerkUser.primaryPhoneNumber?.phoneNumber || "",
      },
    };
  }, [clerkUser]);

  const contextValue = useMemo(() => ({
    user: isSignedIn ? user : null,
    session: isSignedIn ? { user } : null,
    loading: !isLoaded,
    isAdmin,
    signIn,
    signOut,
    signUp,
  }), [isSignedIn, user, isLoaded, isAdmin]);

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

/**
 * NoAuthProvider - No-op auth provider used when Clerk is not configured.
 * All public pages work normally; protected routes redirect to sign-in.
 */
export const NoAuthProvider = ({ children }: { children: ReactNode }) => {
  const value: AuthContextType = useMemo(() => ({
    user: null,
    session: null,
    loading: false,
    isAdmin: false,
    signIn: async () => ({ error: { message: "Auth not configured." } }),
    signUp: async () => ({ error: { message: "Auth not configured." } }),
    signOut: async () => {},
  }), []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * useAuth() - Hook to access auth state from any component.
 */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider or NoAuthProvider");
  return ctx;
};
