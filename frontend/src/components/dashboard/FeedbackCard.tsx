"use client";

import { useState } from "react";
import { Feedback } from "@/types/feedback";
import StatusBadge from "../shared/StatusBadge";
import { Calendar, User, Mail, Sparkles, ChevronDown, AlertCircle } from "lucide-react";
import { updateFeedback } from "@/lib/api";

interface FeedbackCardProps {
  feedback: Feedback;
}

export default function FeedbackCard({ feedback }: FeedbackCardProps) {
  const [status, setStatus] = useState(feedback.status);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  // Helper for priority color
  const getPriorityColor = (priority?: number) => {
    if (!priority) return "bg-gray-100 text-gray-500";
    if (priority >= 8) return "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400";
    if (priority >= 5) return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleStatusChange = async (newStatus: string) => {
    const oldStatus = status;
    const token = localStorage.getItem("token");

    if (!token) return;

    // Optimistic Update
    setStatus(newStatus as any);
    setIsUpdating(true);
    setUpdateError(null);

    try {
      const response = await updateFeedback(token, feedback._id, { status: newStatus });
      if (!response.success) {
        throw new Error(response.message || "Failed to update status");
      }
    } catch (err: any) {
      // Rollback on error
      setStatus(oldStatus);
      setUpdateError("Failed to sync status");
      console.error("Status Update Error:", err);
      
      // Clear error after 3 seconds
      setTimeout(() => setUpdateError(null), 3000);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="group relative flex flex-col gap-5 rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-blue-500/30 hover:shadow-xl hover:shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-blue-500/30 dark:hover:shadow-none">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Selector */}
            <div className="relative inline-flex items-center">
              <StatusBadge 
                type="status" 
                value={status} 
                loading={isUpdating}
                className="pr-6" // Space for the chevron
              />
              <select
                value={status}
                disabled={isUpdating}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="absolute inset-0 w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
              >
                <option value="New">New</option>
                <option value="In Review">In Review</option>
                <option value="Resolved">Resolved</option>
              </select>
              {!isUpdating && (
                <ChevronDown size={12} className="absolute right-2 pointer-events-none text-zinc-400" />
              )}
            </div>

            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              {feedback.category}
            </span>
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
            {feedback.title}
          </h3>
        </div>
        
        {/* Priority Badge */}
        <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl font-bold ${getPriorityColor(feedback.ai_priority)}`}>
          {feedback.ai_priority || "–"}
        </div>
      </div>

      {/* Update Error Toast (local to card) */}
      {updateError && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-[10px] font-medium text-red-600 animate-in fade-in slide-in-from-top-1 duration-300 dark:bg-red-900/20 dark:text-red-400">
          <AlertCircle size={12} />
          {updateError}
        </div>
      )}

      {/* Description Snippet */}
      <p className="text-sm leading-6 text-zinc-600 line-clamp-3 dark:text-zinc-400">
        {feedback.description}
      </p>

      {/* AI Summary (if available) */}
      {feedback.ai_summary && (
        <div className="rounded-xl bg-blue-50/50 p-4 dark:bg-blue-900/10">
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            <Sparkles size={12} />
            AI Summary
          </div>
          <p className="text-xs italic leading-5 text-blue-900 dark:text-blue-300">
            "{feedback.ai_summary}"
          </p>
        </div>
      )}

      {/* Information Grid */}
      <div className="mt-auto grid grid-cols-2 gap-4 border-t border-zinc-100 pt-5 dark:border-zinc-800">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <Calendar size={14} />
            {formatDate(feedback.createdAt)}
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <User size={14} />
            {feedback.submitterName || "Anonymous"}
          </div>
        </div>

        <div className="flex flex-col items-end justify-between gap-2">
          {feedback.ai_sentiment && (
            <StatusBadge type="sentiment" value={feedback.ai_sentiment} />
          )}
          {feedback.submitterEmail && (
            <div className="flex items-center gap-2 text-[10px] text-zinc-400 dark:text-zinc-500 italic truncate max-w-full">
              <Mail size={12} />
              {feedback.submitterEmail}
            </div>
          )}
        </div>
      </div>

      {/* AI Tags */}
      {feedback.ai_tags && feedback.ai_tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {feedback.ai_tags.map((tag) => (
            <span key={tag} className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
