/**
 * useUserProfile.ts — React Query hook for user profile operations
 * 
 * Provides:
 * - Fetching user profile from backend API
 * - Updating profile fields
 * - Auto-caching with React Query
 * - Token injection via Clerk's getToken()
 * 
 * Usage:
 *   const { profile, updateProfile, isLoading } = useUserProfile();
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth as useClerkAuth } from "@clerk/clerk-react";
import axios from "axios";

// Backend API base URL
const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "" : "https://ishu-site.onrender.com");

/**
 * useUserProfile — Hook for fetching and updating the current user's profile
 */
export const useUserProfile = () => {
  const { getToken, isSignedIn } = useClerkAuth();
  const queryClient = useQueryClient();

  // Create an authenticated axios instance
  const authAxios = async () => {
    const token = await getToken();
    return axios.create({
      baseURL: API_BASE,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  };

  // ──── Fetch profile ────
  const {
    data: profile,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const api = await authAxios();
      const { data } = await api.get("/api/user/profile");
      return data.user;
    },
    enabled: !!isSignedIn, // Only fetch when signed in
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 2,
  });

  // ──── Update profile ────
  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Record<string, any>) => {
      const api = await authAxios();
      const { data } = await api.put("/api/user/profile", updates);
      return data.user;
    },
    onSuccess: (updatedUser) => {
      // Update cache immediately
      queryClient.setQueryData(["user-profile"], updatedUser);
    },
  });

  // ──── Get stats ────
  const {
    data: stats,
    isLoading: statsLoading,
  } = useQuery({
    queryKey: ["user-stats"],
    queryFn: async () => {
      const api = await authAxios();
      const { data } = await api.get("/api/user/stats");
      return data;
    },
    enabled: !!isSignedIn,
    staleTime: 10 * 60 * 1000, // Cache 10 minutes
  });

  // ──── Update preferences ────
  const updatePreferencesMutation = useMutation({
    mutationFn: async (preferences: Record<string, any>) => {
      const api = await authAxios();
      const { data } = await api.put("/api/user/preferences", { preferences });
      return data.preferences;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
  });

  return {
    profile,
    isLoading,
    error,
    refetch,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdating: updateProfileMutation.isPending,
    stats: stats?.stats,
    statsLoading,
    updatePreferences: updatePreferencesMutation.mutateAsync,
  };
};

export default useUserProfile;
