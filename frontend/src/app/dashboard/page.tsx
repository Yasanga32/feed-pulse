"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getFeedbacks, getStats } from "@/lib/api";
import { Feedback } from "@/types/feedback";
import StatsBar from "@/components/dashboard/StatsBar";
import FeedbackCard from "@/components/dashboard/FeedbackCard";
import FilterBar from "@/components/dashboard/FilterBar";
import Pagination from "@/components/dashboard/Pagination";
import SummarySection from "@/components/dashboard/SummarySection";
import { LayoutDashboard, Loader2, AlertCircle, RefreshCw, Filter } from "lucide-react";

interface Stats {
  totalFeedback: number;
  openItems: number;
  avgPriority: number;
  mostCommonTag: string;
}

interface QueryParams {
  page: number;
  limit: number;
  sort: string;
  category?: string;
  status?: string;
  search?: string;
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

  // Filtering & Pagination states
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("date");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const router = useRouter();

  // Optimized fetchData with optional parameters
  const fetchData = useCallback(async (isRefresh = false) => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Build query params
      const queryParams: QueryParams = {
        page: currentPage,
        limit: 10,
        sort: sort
      };

      if (category !== "All") queryParams.category = category;
      if (status !== "") queryParams.status = status;
      if (debouncedSearchTerm) queryParams.search = debouncedSearchTerm;

      // Fetch both stats and feedback list
      const [statsRes, feedbackRes] = await Promise.all([
        getStats(token),
        getFeedbacks(token, queryParams),
      ]);

      if (statsRes.success) {
        setStats({
          totalFeedback: statsRes.data.total,
          openItems: statsRes.data.open,
          avgPriority: statsRes.data.average_priority,
          mostCommonTag: statsRes.data.most_common_tag,
        });
      }

      if (feedbackRes.success) {
        setFeedbacks(feedbackRes.data.feedbacks || []);
        // Defensive check for pagination data
        const total = feedbackRes.data.pagination?.totalPages || 1;
        setTotalPages(total);
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
  }, [category, status, sort, debouncedSearchTerm, currentPage, router]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to page 1 on new search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Re-fetch whenever filters change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset to page 1 when filters change
  const handleCategoryChange = (val: string) => {
    setCategory(val);
    setCurrentPage(1);
  };

  const handleStatusChange = (val: string) => {
    setStatus(val);
    setCurrentPage(1);
  };

  const handleSortChange = (val: string) => {
    setSort(val);
    setCurrentPage(1);
  };

  // Handle delete
  const handleDeleteFeedback = (id: string) => {
    setFeedbacks((prev) => prev.filter((item) => item._id !== id));

    setStats((prev) => ({
      ...prev,
      totalFeedback: prev.totalFeedback - 1,
    }));
  };

  if (loading && feedbacks.length === 0) {
    return (
      <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-zinc-200 border-t-blue-600"></div>
          <Loader2
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600 animate-pulse"
            size={24}
          />
        </div>
        <p className="text-zinc-500 font-medium">
          Loading FeedPulse insights...
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
          onClick={() => fetchData(true)}
          className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 active:scale-95"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
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
            onClick={() => fetchData(true)}
            className="mt-6 rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-bold text-white dark:bg-white dark:text-black"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="space-y-12">
          <SummarySection />
          {/* Stats */}
          <StatsBar stats={stats} />

          {/* Filters */}
          <FilterBar
            selectedCategory={category}
            onCategoryChange={handleCategoryChange}
            selectedStatus={status}
            onStatusChange={handleStatusChange}
            selectedSort={sort}
            onSortChange={handleSortChange}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          {/* Feedback Section */}
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                Recent Feedback
                {(category !== "All" || status !== "") && (
                  <span className="ml-2 text-sm font-normal text-zinc-400">
                    (Filtered)
                  </span>
                )}
              </h2>

              <span className="text-sm font-medium text-zinc-500">
                {stats.totalFeedback} total items
              </span>
            </div>

            {feedbacks.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 p-20 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/10">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-zinc-800">
                  <Filter size={32} />
                </div>
                <p className="text-lg font-semibold text-zinc-900 dark:text-white">
                  No results found
                </p>
                <p className="mt-1 text-zinc-500 text-sm">
                  Try adjusting your filters.
                </p>

                {(category !== "All" || status !== "" || searchTerm !== "") && (
                  <button
                    onClick={() => {
                      setCategory("All");
                      setStatus("");
                      setSearchTerm("");
                      setCurrentPage(1);
                    }}
                    className="mt-6 text-sm font-bold text-blue-600 hover:underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 relative">
                  {loading && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/40 backdrop-blur-[1px] dark:bg-black/40">
                      <Loader2 className="animate-spin text-blue-600" size={32} />
                    </div>
                  )}

                  {feedbacks.map((item) => (
                    <FeedbackCard
                      key={item._id}
                      feedback={item}
                      onDelete={handleDeleteFeedback}
                    />
                  ))}
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}