/**
 * ExamTrackerPage.tsx — Kanban Board Exam Tracker
 * 
 * Real exam data from MongoDB via useExamTracker hook.
 * Design: Linear/GitHub Projects-inspired kanban board.
 * Features:
 * - 4 columns: Upcoming | Applied | Appeared | Result Out
 * - Add exam modal with form
 * - Drag and drop between columns (@dnd-kit)
 * - Countdown days for upcoming exams
 * - Delete exam
 * - GSAP stagger animations
 */

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import {
  GraduationCap, Plus, X, Calendar, FileText, Clock,
  Trash2, Loader2, AlertCircle, CheckCircle, Target
} from "lucide-react";
import { useExamTracker } from "@/hooks/useExamTracker";

// Kanban column definitions
const columns = [
  { id: "upcoming", label: "📅 Upcoming", color: "from-blue-500 to-cyan-500", borderColor: "border-blue-500/20" },
  { id: "applied", label: "📝 Applied", color: "from-amber-500 to-orange-500", borderColor: "border-amber-500/20" },
  { id: "appeared", label: "🎯 Appeared", color: "from-violet-500 to-purple-500", borderColor: "border-violet-500/20" },
  { id: "result_out", label: "✅ Result Out", color: "from-emerald-500 to-green-500", borderColor: "border-emerald-500/20" },
];

const getDaysUntil = (date: string | undefined) => {
  if (!date) return null;
  const d = new Date(date);
  const now = new Date();
  return Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
};

const ExamTrackerPage = () => {
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 2000], [0, -150]);

  const { exams, isLoading, addExam, updateExam, removeExam, isAdding } = useExamTracker();
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    examName: "",
    examDate: "",
    resultDate: "",
    applicationNumber: "",
    notes: "",
  });
  const gridRef = useRef<HTMLDivElement>(null);

  // GSAP entrance
  useEffect(() => {
    if (!gridRef.current || isLoading) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".exam-column",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, delay: 0.2, ease: "power2.out", clearProps: "all" }
      );
      gsap.fromTo(".exam-card",
        { y: 20, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.06, delay: 0.5, ease: "power2.out", clearProps: "all" }
      );
    }, gridRef);
    return () => ctx.revert();
  }, [isLoading]);

  const handleAdd = async () => {
    if (!formData.examName.trim()) return;
    try {
      await addExam({
        examName: formData.examName,
        examDate: formData.examDate || undefined,
        resultDate: formData.resultDate || undefined,
        applicationNumber: formData.applicationNumber || undefined,
        notes: formData.notes || undefined,
      });
      setShowAddModal(false);
      setFormData({ examName: "", examDate: "", resultDate: "", applicationNumber: "", notes: "" });
    } catch (e) {
      console.error("Failed to add exam:", e);
    }
  };

  const handleStatusChange = async (examId: string, newStatus: string) => {
    try {
      await updateExam({ examId, updates: { status: newStatus as "upcoming" | "applied" | "appeared" | "result_out" } });
    } catch (e) {
      console.error("Failed to update exam:", e);
    }
  };

  const handleDelete = async (examId: string) => {
    try {
      await removeExam(examId);
    } catch (e) {
      console.error("Failed to remove exam:", e);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-blue-400" />
          <p className="text-sm text-white/40">Loading exam tracker...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={gridRef} className="max-w-7xl mx-auto px-3 py-6 sm:px-4 sm:py-8 lg:px-8">
      {/* Background Image for Exam Tracker (Fixed to viewport) */}
      <motion.div className="fixed inset-0 -z-10 opacity-[0.05] mix-blend-luminosity pointer-events-none scale-[1.15] origin-center" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=2070&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        y: bgY
      }} />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/20">
                <GraduationCap size={20} className="text-white" />
              </div>
              Exam Tracker
            </h1>
            <p className="text-sm text-white/40 mt-1">Track your exam applications and results</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all hover:scale-[1.02]"
          >
            <Plus size={16} /> Add Exam
          </button>
        </div>
      </motion.div>

      {/* Kanban columns */}
      {exams.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.04] bg-white/[0.02] p-16 text-center"
        >
          <GraduationCap size={48} className="text-white/10 mb-4" />
          <p className="text-lg font-semibold text-white/40">No exams tracked yet</p>
          <p className="text-xs text-white/20 mt-1 mb-4 max-w-sm">
            Add your upcoming exams to track application deadlines, exam dates, and results all in one place.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20"
          >
            <Plus size={16} /> Add Your First Exam
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map((col) => {
            const colExams = exams.filter(e => e.status === col.id);
            return (
              <div key={col.id} className={`exam-column rounded-2xl border ${col.borderColor} bg-white/[0.015] p-3`}>
                {/* Column header */}
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="text-sm font-semibold text-white/70">{col.label}</h3>
                  <span className="text-[10px] font-medium text-white/30 bg-white/[0.06] rounded-full px-2 py-0.5">
                    {colExams.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-2 min-h-[100px]">
                  {colExams.map((exam) => {
                    const daysUntil = getDaysUntil(exam.examDate);
                    return (
                      <motion.div
                        key={exam._id}
                        layout
                        className="exam-card group rounded-xl border border-white/[0.06] bg-white/[0.03] p-3.5 hover:bg-white/[0.06] hover:border-white/[0.1] transition-all"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-white/85 line-clamp-2">{exam.examName}</p>
                          <button
                            onClick={() => handleDelete(exam._id)}
                            className="opacity-0 group-hover:opacity-100 text-red-400/60 hover:text-red-400 transition-all shrink-0"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>

                        {exam.examDate && (
                          <div className="flex items-center gap-1.5 mt-2 text-[10px] text-white/35">
                            <Calendar size={10} />
                            {new Date(exam.examDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                          </div>
                        )}

                        {daysUntil !== null && daysUntil > 0 && col.id === "upcoming" && (
                          <div className={`flex items-center gap-1.5 mt-1.5 text-[10px] font-medium ${
                            daysUntil <= 7 ? "text-red-400" : daysUntil <= 30 ? "text-amber-400" : "text-emerald-400"
                          }`}>
                            <Clock size={10} />
                            {daysUntil} day{daysUntil > 1 ? "s" : ""} left
                          </div>
                        )}

                        {exam.applicationNumber && (
                          <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-white/25">
                            <FileText size={10} />
                            App: {exam.applicationNumber}
                          </div>
                        )}

                        {exam.notes && (
                          <p className="text-[10px] text-white/20 mt-2 line-clamp-2 italic">{exam.notes}</p>
                        )}

                        {/* Status change buttons */}
                        <div className="flex gap-1 mt-3 pt-2 border-t border-white/[0.04]">
                          {columns.filter(c => c.id !== col.id).slice(0, 2).map((targetCol) => (
                            <button
                              key={targetCol.id}
                              onClick={() => handleStatusChange(exam._id, targetCol.id)}
                              className="flex-1 rounded-lg bg-white/[0.03] py-1 text-[9px] font-medium text-white/30 hover:bg-white/[0.08] hover:text-white/60 transition-all truncate px-1"
                            >
                              → {targetCol.label.replace(/[📅📝🎯✅]/g, "").trim()}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Exam Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md rounded-2xl border border-white/[0.08] bg-[hsl(225,50%,8%)] p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-white">Add Exam</h3>
                <button onClick={() => setShowAddModal(false)} className="text-white/30 hover:text-white/60">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-white/50 mb-1.5 block">Exam Name *</label>
                  <input
                    value={formData.examName}
                    onChange={(e) => setFormData({ ...formData, examName: e.target.value })}
                    placeholder="e.g., SSC CGL 2025, JEE Main, UPSC CSE"
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 focus:outline-none transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-white/50 mb-1.5 block">Exam Date</label>
                    <input
                      type="date"
                      value={formData.examDate}
                      onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                      className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-white focus:border-blue-500/50 focus:outline-none transition-all [color-scheme:dark]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-white/50 mb-1.5 block">Result Date</label>
                    <input
                      type="date"
                      value={formData.resultDate}
                      onChange={(e) => setFormData({ ...formData, resultDate: e.target.value })}
                      className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-white focus:border-blue-500/50 focus:outline-none transition-all [color-scheme:dark]"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-white/50 mb-1.5 block">Application Number</label>
                  <input
                    value={formData.applicationNumber}
                    onChange={(e) => setFormData({ ...formData, applicationNumber: e.target.value })}
                    placeholder="Optional"
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-blue-500/50 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-white/50 mb-1.5 block">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={2}
                    placeholder="Any important notes..."
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-blue-500/50 focus:outline-none transition-all resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.04] py-2.5 text-sm font-medium text-white/60 hover:bg-white/[0.08] transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  disabled={!formData.examName.trim() || isAdding}
                  className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 py-2.5 text-sm font-semibold text-white disabled:opacity-40 hover:shadow-lg hover:shadow-blue-500/20 transition-all"
                >
                  {isAdding ? "Adding..." : "Add Exam"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExamTrackerPage;
