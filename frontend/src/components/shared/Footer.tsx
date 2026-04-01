export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-200 bg-white/50 py-12 dark:border-zinc-800 dark:bg-black/50">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600">
            <span className="font-bold text-lg">F</span>
          </div>
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            FeedPulse AI
          </p>
          <p className="max-w-xs text-xs leading-5 text-zinc-500 dark:text-zinc-400">
            Automating feedback categorization, prioritization, and summarization for modern product teams.
          </p>
        </div>

        <div className="mt-8 flex justify-center gap-6 text-xs text-zinc-500">
          <span>&copy; {currentYear} FeedPulse AI. All rights reserved.</span>
          <span className="cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Privacy</span>
          <span className="cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Terms</span>
        </div>
      </div>
    </footer>
  );
}
