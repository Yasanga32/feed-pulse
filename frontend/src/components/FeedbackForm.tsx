"use client";

import { useState } from "react";
import { submitFeedback } from "@/lib/api";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

// Simple interface for our form fields
interface FeedbackFormData {
  title: string;
  description: string;
  category: "Bug" | "Feature Request" | "Improvement" | "Other";
  submitterName: string;
  submitterEmail: string;
}

export default function FeedbackForm() {
  const [formData, setFormData] = useState<FeedbackFormData>({
    title: "",
    description: "",
    category: "Feature Request",
    submitterName: "",
    submitterEmail: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }
    if (formData.description.length < 20) {
      setError("Description must be at least 20 characters long");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await submitFeedback(formData);
      if (response.success) {
        setSuccess(true);
        setFormData({
          title: "",
          description: "",
          category: "Feature Request",
          submitterName: "",
          submitterEmail: "",
        });
      } else {
        setError(response.message || "Failed to submit feedback");
      }
    } catch (error: unknown) {
      console.error("Submission error:", error);
      setError("Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center animate-in fade-in zoom-in duration-500">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30">
          <CheckCircle2 size={32} />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-white">Feedback Received!</h2>
        <p className="mb-8 max-w-sm text-zinc-600 dark:text-zinc-400">
          Thank you for helping us improve. Our AI is analyzing your suggestion right now.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="rounded-full bg-zinc-900 px-8 py-3 font-semibold text-white transition-all hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          Submit another feedback
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-900/50 dark:shadow-none">
      <div className="border-b border-zinc-100 bg-zinc-50/50 p-6 dark:border-zinc-800 dark:bg-zinc-800/30">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Share your feedback</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Help us shape the future of FeedPulse.</p>
      </div>

      <div className="space-y-6 p-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="mb-1 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Subject <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            maxLength={120}
            placeholder="A short summary of your feedback..."
            value={formData.title}
            onChange={handleChange}
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-black outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-blue-400"
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="mb-1 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full cursor-pointer rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-black outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-blue-400"
          >
            <option value="Bug">Bug Report</option>
            <option value="Feature Request">Feature Request</option>
            <option value="Improvement">Improvement</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label htmlFor="description" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Description <span className="text-red-500">*</span>
            </label>
            <span className={`text-xs font-medium ${formData.description.length < 20 ? 'text-amber-500' : 'text-green-500'}`}>
              {formData.description.length} / 20+ chars
            </span>
          </div>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            placeholder="Please provide details about your suggestion or the problem you encountered..."
            value={formData.description}
            onChange={handleChange}
            className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-black outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-blue-400"
          />
        </div>

        {/* Submitter Details (Optional) */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="submitterName" className="mb-1 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Your Name <span className="text-xs text-zinc-400">(Optional)</span>
            </label>
            <input
              type="text"
              id="submitterName"
              name="submitterName"
              placeholder="Full name"
              value={formData.submitterName}
              onChange={handleChange}
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-black outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-blue-400"
            />
          </div>
          <div>
            <label htmlFor="submitterEmail" className="mb-1 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Your Email <span className="text-xs text-zinc-400">(Optional)</span>
            </label>
            <input
              type="email"
              id="submitterEmail"
              name="submitterEmail"
              placeholder="email@example.com"
              value={formData.submitterEmail}
              onChange={handleChange}
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-black outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-blue-400"
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400 animate-in slide-in-from-top duration-300">
            <AlertCircle size={18} />
            <p>{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-xl bg-blue-600 py-3.5 font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-700 hover:shadow-blue-500/40 disabled:cursor-not-allowed disabled:opacity-70 active:scale-[0.98]"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            "Submit Feedback"
          )}
        </button>
      </div>
    </form>
  );
}
