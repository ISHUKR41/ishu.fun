/**
 * useBookmarks.ts — Hook for bookmark CRUD operations
 * Uses React Query for caching + Clerk auth for API calls
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth as useClerkAuth } from "@clerk/clerk-react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "" : "https://ishu-site.onrender.com");

export const useBookmarks = (typeFilter?: string) => {
  const { getToken, isSignedIn } = useClerkAuth();
  const queryClient = useQueryClient();

  const authAxios = async () => {
    const token = await getToken();
    return axios.create({
      baseURL: API_BASE,
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
  };

  // Fetch bookmarks with optional type filter
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["bookmarks", typeFilter],
    queryFn: async () => {
      const api = await authAxios();
      const params = typeFilter ? `?type=${typeFilter}` : "";
      const { data } = await api.get(`/api/user/bookmarks${params}`);
      return data;
    },
    enabled: !!isSignedIn,
    staleTime: 2 * 60 * 1000,
  });

  // Add bookmark
  const addBookmark = useMutation({
    mutationFn: async (bookmark: { type: string; itemId: string; title: string; url?: string; thumbnail?: string }) => {
      const api = await authAxios();
      const { data } = await api.post("/api/user/bookmarks", bookmark);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookmarks"] }),
  });

  // Remove bookmark
  const removeBookmark = useMutation({
    mutationFn: async (itemId: string) => {
      const api = await authAxios();
      const { data } = await api.delete(`/api/user/bookmarks/${itemId}`);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookmarks"] }),
  });

  return {
    bookmarks: data?.bookmarks || [],
    total: data?.total || 0,
    isLoading,
    error,
    refetch,
    addBookmark: addBookmark.mutateAsync,
    removeBookmark: removeBookmark.mutateAsync,
    isAdding: addBookmark.isPending,
    isRemoving: removeBookmark.isPending,
  };
};
