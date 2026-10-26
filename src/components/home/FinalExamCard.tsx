"use client";

import Link from "next/link";
import { Trophy } from "lucide-react";
import type { ExamAttempt } from "@/lib/storage";

export default function FinalExamCard({ history }: { history: ExamAttempt[] }) {
  const best = history.length > 0 ? Math.max(...history.map((h) => h.score)) : null;

  return (
    <Link
      href="/exam"
      className="focus-ring group relative col-span-full flex flex-col gap-3 overflow-hidden rounded-2xl border border-accent-blue/30 bg-accent-gradient p-5 shadow-glow transition-transform duration-200 hover:scale-[1.01] sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
          <Trophy className="h-6 w-6 text-white" aria-hidden="true" />
        </span>
        <div>
          <h3 className="text-lg font-bold text-white">Final HSK 3 Mock Exam</h3>
          <p className="text-sm text-white/80">
            ~50 questions across all 20 lessons &middot; 45 minute timer
          </p>
        </div>
      </div>
      <div className="text-sm font-semibold text-white">
        {best !== null ? `Best score: ${best}%` : "Not attempted yet"}
      </div>
    </Link>
  );
}
