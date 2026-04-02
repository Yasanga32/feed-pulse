"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getFeedbacks, getStats } from "@/lib/api";
import { Feedback } from "@/types/feedback";
import StatsBar from "@/components/dashboard/StatsBar";
import FeedbackCard from "@/components/dashboard/FeedbackCard";
import { LayoutDashboard, Loader2, AlertCircle, RefreshCw } from "lucide-react";

interface Stats {
  totalFeedback: number;
  openItems: number;
  avgPriority: number;
  mostCommonTag: string;
}

export default function DashboardPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalFeedback: 0,
    openItems: 0,
    avgPriority: 0,
    mostCommonTag: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch both stats and feedback list
      const [statsRes, feedbackRes] = await Promise.all([
        getStats(token),
        getFeedbacks(token),
      ]);

      // Map backend response to frontend format
      if (statsRes.success) {
        setStats({
          totalFeedback: statsRes.data.total,
          openItems: statsRes.data.open,
          avgPriority: statsRes.data.average_priority,
          mostCommonTag: statsRes.data.most_common_tag,
        });
      }

      if (feedbackRes.success) {
        setFeedbacks(feedbackRes.data);
      }

      if (!statsRes.success || !feedbackRes.success) {
        setError("Failed to fetch some dashboard data.");
      }
    } catch (err: unknown) {
      setError("An error occurred while connecting to the backend.");
      console.error("Dashboard Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-zinc-500 font-medium">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-blue-600">
            <LayoutDashboard size={14} />
            Overview
          </div>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Admin Dashboard
          </h1>
        </div>

        <button
          onClick={fetchData}
          className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
        >
          <RefreshCw size={14} />
          Sync Data
        </button>
      </div>

      {error ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-red-100 p-12 text-center dark:border-red-900/20">
          <AlertCircle className="mb-4 text-red-500" size={48} />
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
            Something went wrong
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            {error}
          </p>
          <button
            onClick={fetchData}
            className="mt-6 rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-bold text-white dark:bg-white dark:text-black"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Stats Section */}
          <StatsBar stats={stats} />

          {/* Feedback List Section */}
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                Recent Feedback
              </h2>
              <span className="text-sm font-medium text-zinc-500">
                {feedbacks.length} items found
              </span>
            </div>

            {feedbacks.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 p-20 dark:border-zinc-800">
                <p className="text-zinc-500">
                  No feedback submitted yet. Your users&apos; voices will appear here!
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {feedbacks.map((item) => (
                  <FeedbackCard key={item._id} feedback={item} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}