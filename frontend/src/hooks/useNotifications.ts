/**
 * useNotifications.ts — Hook for notification operations
 * 
 * Fetches notifications from API with real-time polling (30s).
 * Provides mark-as-read, mark-all-read, and clear mutations.
 * Uses React Query for caching + Clerk auth.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth as useClerkAuth } from "@clerk/clerk-react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "" : "https://ishu-site.onrender.com");

export const useNotifications = () => {
  const { getToken, isSignedIn } = useClerkAuth();
  const queryClient = useQueryClient();

  const authAxios = async () => {
    const token = await getToken();
    return axios.create({
      baseURL: API_BASE,
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
  };

  // ──── Fetch notifications (auto-refresh every 30s) ────
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const api = await authAxios();
      const { data } = await api.get("/api/user/notifications");
      return data;
    },
    enabled: !!isSignedIn,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Poll every 30s for real-time feel
  });

  // ──── Mark single notification as read ────
  const markAsRead = useMutation({
    mutationFn: async (notifId: string) => {
      const api = await authAxios();
      await api.patch(`/api/user/notifications/${notifId}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  // ──── Mark ALL notifications as read ────
  const markAllAsRead = useMutation({
    mutationFn: async (ids: string[]) => {
      const api = await authAxios();
      await api.patch("/api/user/notifications/read-all", { ids });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  // ──── Clear all notifications ────
  const clearAll = useMutation({
    mutationFn: async () => {
      const api = await authAxios();
      await api.delete("/api/user/notifications/clear");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const notifications = data?.notifications || [];
  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  return {
    notifications,
    total: data?.total || 0,
    unreadCount,
    isLoading,
    error,
    refetch,
    markAsRead: markAsRead.mutateAsync,
    markAllAsRead: markAllAsRead.mutateAsync,
    clearAll: clearAll.mutateAsync,
    isMarkingRead: markAsRead.isPending,
    isMarkingAll: markAllAsRead.isPending,
    isClearing: clearAll.isPending,
  };
};
