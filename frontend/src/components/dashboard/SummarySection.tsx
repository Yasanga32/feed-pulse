"use client";

import { Sparkles, TrendingUp, AlertCircle, RefreshCcw, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getSummary } from "@/lib/api";

interface SummaryData {
  summary: string;
  top_themes: string[];
}

export default function SummarySection() {
  const [data, setData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const res = await getSummary(token);
      if (res.success && typeof res.data !== "string") {
        setData(res.data);
      } else if (typeof res.data === "string") {
        // Handle "No feedback" case
        setError(res.data);
      } else {
        setError("Could not generate summary.");
      }
    } catch (err) {
      setError("Failed to connect to AI service.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="mb-10 w-full animate-pulse rounded-3xl border border-zinc-200 bg-white/50 p-8 dark:border-zinc-800 dark:bg-zinc-900/30">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
          <div className="h-4 w-48 rounded bg-zinc-200 dark:bg-zinc-800"></div>
        </div>
        <div className="mt-6 space-y-3">
          <div className="h-4 w-full rounded bg-zinc-100 dark:bg-zinc-900"></div>
          <div className="h-4 w-2/3 rounded bg-zinc-100 dark:bg-zinc-900"></div>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="mb-10 flex items-center justify-between rounded-3xl border border-zinc-100 bg-zinc-50/50 p-6 dark:border-zinc-800/50 dark:bg-zinc-900/20">
        <div className="flex items-center gap-3 text-zinc-500">
          <AlertCircle size={20} />
          <span className="text-sm font-medium">{error}</span>
        </div>
        <button 
          onClick={fetchSummary}
          className="text-xs font-bold text-blue-600 hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="group relative mb-10 overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-white to-blue-50/30 p-8 shadow-xl shadow-blue-500/5 transition-all hover:shadow-blue-500/10 dark:border-blue-900/20 dark:from-zinc-900 dark:to-blue-900/10">
      {/* Decorative Background Icon */}
      <div className="absolute -right-8 -top-8 text-blue-500/5 transition-transform group-hover:scale-110">
        <Sparkles size={160} />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/30">
              <Sparkles size={20} fill="currentColor" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">AI Trend Insights</h3>
              <p className="text-xs font-medium text-zinc-500">Last 7 Days Analysis</p>
            </div>
          </div>
          <button 
            onClick={fetchSummary}
            className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 transition-all hover:bg-white hover:text-blue-600 dark:hover:bg-zinc-800"
            title="Refresh Summary"
          >
            <RefreshCcw size={16} />
          </button>
        </div>

        <div className="mt-6">
          <p className="text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
            {data?.summary}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <div className="mr-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            <TrendingUp size={14} />
            Top Themes:
          </div>
          {data?.top_themes.map((theme, i) => (
            <span 
              key={i} 
              className="rounded-full border border-blue-100 bg-white px-4 py-1.5 text-sm font-bold text-blue-700 shadow-sm transition-all hover:scale-105 hover:bg-blue-50 dark:border-blue-900/30 dark:bg-zinc-800 dark:text-blue-300"
            >
              {theme}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
