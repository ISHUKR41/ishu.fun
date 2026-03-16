/**
 * useToolHistory.ts — Hook for tool usage history operations
 * 
 * Fetches paginated tool history from API.
 * Uses React Query for caching + Clerk auth.
 */

import { useQuery } from "@tanstack/react-query";
import { useAuth as useClerkAuth } from "@clerk/clerk-react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "https://ishu-site.onrender.com";

export const useToolHistory = (page: number = 1, limit: number = 20) => {
  const { getToken, isSignedIn } = useClerkAuth();

  const authAxios = async () => {
    const token = await getToken();
    return axios.create({
      baseURL: API_BASE,
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["tool-history", page, limit],
    queryFn: async () => {
      const api = await authAxios();
      const { data } = await api.get(`/api/user/tool-history?page=${page}&limit=${limit}`);
      return data;
    },
    enabled: !!isSignedIn,
    staleTime: 2 * 60 * 1000, // Cache 2 minutes
  });

  return {
    history: data?.history || [],
    favorites: data?.favorites || [],
    total: data?.total || 0,
    page: data?.page || 1,
    totalPages: data?.totalPages || 1,
    isLoading,
    error,
    refetch,
  };
};
