"use client";

import { Filter, ChevronDown, ArrowUpDown, Clock, Zap, Smile } from "lucide-react";

interface FilterBarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedSort: string;
  onSortChange: (sort: string) => void;
}

const CATEGORIES = ["All", "Bug", "Feature Request", "Improvement", "Other"];
const STATUSES = ["All Statuses", "New", "In Review", "Resolved"];
const SORTS = [
  { value: "date", label: "Newest First", icon: <Clock size={14} /> },
  { value: "priority", label: "Highest Priority", icon: <Zap size={14} /> },
  { value: "sentiment", label: "AI Sentiment", icon: <Smile size={14} /> },
];

export default function FilterBar({
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  selectedSort,
  onSortChange,
}: FilterBarProps) {
  const currentSort = SORTS.find(s => s.value === selectedSort) || SORTS[0];

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-zinc-50/50 p-2 dark:bg-zinc-900/30 lg:flex-row lg:items-center lg:justify-between lg:p-4">
      {/* Category Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
        <div className="mr-2 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-zinc-200/50 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
          <Filter size={16} />
        </div>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${
              selectedCategory === cat
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "text-zinc-600 hover:bg-zinc-200/50 dark:text-zinc-400 dark:hover:bg-zinc-800"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Selectors Group */}
      <div className="flex flex-col gap-3 sm:flex-row">
        {/* Status Dropdown */}
        <div className="relative inline-flex items-center">
          <div className="flex h-10 w-full items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-bold text-zinc-700 shadow-sm transition-all hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-700 sm:w-44">
            <span className="truncate">
              {selectedStatus === "" ? "Any Status" : selectedStatus}
            </span>
            <ChevronDown size={14} className="text-zinc-400" />

            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="absolute inset-0 w-full cursor-pointer opacity-0"
            >
              {STATUSES.map((status) => (
                <option key={status} value={status === "All Statuses" ? "" : status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="relative inline-flex items-center">
          <div className="flex h-10 w-full items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-bold text-zinc-700 shadow-sm transition-all hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-700 sm:w-48">
            <div className="flex items-center gap-2 truncate">
              <ArrowUpDown size={14} className="text-zinc-400" />
              <span>{currentSort.label}</span>
            </div>
            <ChevronDown size={14} className="text-zinc-400" />

            <select
              value={selectedSort}
              onChange={(e) => onSortChange(e.target.value)}
              className="absolute inset-0 w-full cursor-pointer opacity-0"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
