"use client";

import { Flag } from "lucide-react";
import type { ExamQuestion } from "@/lib/exam";

export default function ExamNavigator({
  questions,
  currentIndex,
  answers,
  flagged,
  onJump,
}: {
  questions: ExamQuestion[];
  currentIndex: number;
  answers: Record<string, unknown>;
  flagged: Set<string>;
  onJump: (index: number) => void;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-surface p-4 shadow-card">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-muted">
        Questions
      </h2>
      <div className="grid grid-cols-8 gap-1.5 sm:grid-cols-6 lg:grid-cols-5">
        {questions.map((q, i) => {
          const isAnswered = answers[q.id] !== undefined;
          const isFlagged = flagged.has(q.id);
          const isCurrent = i === currentIndex;
          return (
            <button
              key={q.id}
              onClick={() => onJump(i)}
              aria-label={`Go to question ${i + 1}${isAnswered ? ", answered" : ", unanswered"}${
                isFlagged ? ", flagged" : ""
              }`}
              aria-current={isCurrent}
              className={`focus-ring relative flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
                isCurrent
                  ? "bg-accent-gradient text-white shadow-glow"
                  : isAnswered
                    ? "bg-accent-blue/20 text-ink"
                    : "bg-white/5 text-ink-muted hover:bg-white/10"
              }`}
            >
              {i + 1}
              {isFlagged && (
                <Flag
                  className="absolute -right-1 -top-1 h-3 w-3 fill-warning text-warning"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap gap-3 text-xs text-ink-muted">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-accent-blue/60" /> Answered
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-white/20" /> Unanswered
        </span>
        <span className="flex items-center gap-1">
          <Flag className="h-3 w-3 fill-warning text-warning" aria-hidden="true" /> Flagged
        </span>
      </div>
    </div>
  );
}
