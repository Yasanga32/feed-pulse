"use client";

interface StatusBadgeProps {
  type: "status" | "sentiment";
  value: string;
  loading?: boolean;
  className?: string;
}

export default function StatusBadge({ type, value, loading, className = "" }: StatusBadgeProps) {
  const getStyles = () => {
    // Status Styles
    if (type === "status") {
      switch (value) {
        case "New":
          return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800";
        case "In Review":
          return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800";
        case "Resolved":
          return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800";
        default:
          return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700";
      }
    }

    // Sentiment Styles
    if (type === "sentiment") {
      switch (value) {
        case "Positive":
          return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
        case "Neutral":
          return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700";
        case "Negative":
          return "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800";
        default:
          return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700";
      }
    }

    return "";
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-300 ${getStyles()} ${loading ? "animate-pulse opacity-70" : ""} ${className}`}>
      {loading ? "Updating..." : value}
    </span>
  );
}
