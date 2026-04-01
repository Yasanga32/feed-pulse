export interface Feedback {
  _id: string;
  title: string;
  description: string;
  category: "Bug" | "Feature Request" | "Improvement" | "Other";
  status: "New" | "In Review" | "Resolved";
  submitterName?: string;
  submitterEmail?: string;
  
  // AI processed fields
  ai_category?: string;
  ai_sentiment?: "Positive" | "Neutral" | "Negative";
  ai_priority?: number;
  ai_summary?: string;
  ai_tags?: string[];
  ai_processed: boolean;
  
  createdAt: string;
  updatedAt: string;
}
