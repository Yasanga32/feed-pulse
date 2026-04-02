"use client";

import { BarChart3, MessageSquare, CheckCircle2, Tag } from "lucide-react";
import StatsCard from "./StatsCard";

export interface Stats {
  totalFeedback: number;
  openItems: number;
  avgPriority: number;
  mostCommonTag: string;
}

interface StatsBarProps {
  stats: Stats;
}

export default function StatsBar({ stats }: StatsBarProps) {
  const {
    totalFeedback,
    openItems,
    avgPriority,
    mostCommonTag
  } = stats;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Feedback"
        value={totalFeedback}
        icon={<MessageSquare className="text-blue-600" size={20} />}
        description="All-time submissions"
        color="bg-blue-600 text-blue-600"
      />

      <StatsCard
        title="Open Items"
        value={openItems}
        icon={<BarChart3 className="text-amber-600" size={20} />}
        description="Awaiting resolution"
        color="bg-amber-600 text-amber-600"
      />

      <StatsCard
        title="Avg. Priority"
        value={(avgPriority || 0).toFixed(1)}
        icon={<CheckCircle2 className="text-emerald-600" size={20} />}
        description="AI-calculated urgency"
        color="bg-emerald-600 text-emerald-600"
      />

      <StatsCard
        title="Most Common Tag"
        value={mostCommonTag || "N/A"}
        icon={<Tag className="text-purple-600" size={20} />}
        description="Top trend detected"
        color="bg-purple-600 text-purple-600"
      />
    </div>
  );
}