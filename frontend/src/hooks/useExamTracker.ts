/**
 * useExamTracker.ts — Hook for exam tracker CRUD operations
 * Uses React Query for caching + Clerk auth for API calls
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth as useClerkAuth } from "@clerk/clerk-react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "https://ishu-site.onrender.com";

interface TrackedExam {
  _id: string;
  examName: string;
  status: "upcoming" | "applied" | "appeared" | "result_out";
  applicationNumber?: string;
  rollNumber?: string;
  examDate?: string;
  resultDate?: string;
  notes?: string;
  addedAt?: string;
}

export const useExamTracker = () => {
  const { getToken, isSignedIn } = useClerkAuth();
  const queryClient = useQueryClient();

  const authAxios = async () => {
    const token = await getToken();
    return axios.create({
      baseURL: API_BASE,
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
  };

  // Fetch all tracked exams
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["exam-tracker"],
    queryFn: async () => {
      const api = await authAxios();
      const { data } = await api.get("/api/user/tracker");
      return data;
    },
    enabled: !!isSignedIn,
    staleTime: 2 * 60 * 1000,
  });

  // Add exam
  const addExam = useMutation({
    mutationFn: async (exam: { examName: string; examDate?: string; resultDate?: string; applicationNumber?: string; notes?: string; status?: string }) => {
      const api = await authAxios();
      const { data } = await api.post("/api/user/tracker", exam);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exam-tracker"] });
      queryClient.invalidateQueries({ queryKey: ["user-stats"] });
    },
  });

  // Update exam
  const updateExam = useMutation({
    mutationFn: async ({ examId, updates }: { examId: string; updates: Partial<TrackedExam> }) => {
      const api = await authAxios();
      const { data } = await api.put(`/api/user/tracker/${examId}`, updates);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["exam-tracker"] }),
  });

  // Remove exam
  const removeExam = useMutation({
    mutationFn: async (examId: string) => {
      const api = await authAxios();
      const { data } = await api.delete(`/api/user/tracker/${examId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exam-tracker"] });
      queryClient.invalidateQueries({ queryKey: ["user-stats"] });
    },
  });

  return {
    exams: (data?.exams || []) as TrackedExam[],
    isLoading,
    error,
    refetch,
    addExam: addExam.mutateAsync,
    updateExam: updateExam.mutateAsync,
    removeExam: removeExam.mutateAsync,
    isAdding: addExam.isPending,
    isUpdating: updateExam.isPending,
    isRemoving: removeExam.isPending,
  };
};
