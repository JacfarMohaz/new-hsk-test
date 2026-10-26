"use client";

import { Headphones, ListChecks, PenLine, Shuffle, Trophy } from "lucide-react";
import { EXAM_CONFIG } from "@/lib/exam";
import type { ExamAttempt } from "@/lib/storage";

const SECTIONS = [
  { icon: Headphones, label: "Listening", count: EXAM_CONFIG.part1Count },
  { icon: ListChecks, label: "Reading match", count: EXAM_CONFIG.part2Count },
  { icon: ListChecks, label: "Fill in the blank", count: EXAM_CONFIG.part3Count },
  { icon: Shuffle, label: "Sentence ordering", count: EXAM_CONFIG.part4Count },
  { icon: PenLine, label: "Pinyin → Hanzi", count: EXAM_CONFIG.part5Count },
];

export default function ExamIntro({
  history,
  onStart,
}: {
  history: ExamAttempt[];
  onStart: () => void;
}) {
  const total = SECTIONS.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-8 text-center">
        <Trophy className="mx-auto mb-3 h-10 w-10 text-warning" aria-hidden="true" />
        <h1 className="text-3xl font-black text-ink">Final HSK 3 Mock Exam</h1>
        <p className="mt-2 text-ink-muted">
          {total} questions drawn from all 20 lessons &middot; {EXAM_CONFIG.durationMinutes} minute
          timer &middot; pass at 60%
        </p>
      </header>

      <ul className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {SECTIONS.map(({ icon: Icon, label, count }) => (
          <li
            key={label}
            className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-surface p-4"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-gradient">
              <Icon className="h-4 w-4 text-white" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">{label}</p>
              <p className="text-xs text-ink-muted">{count} questions</p>
            </div>
          </li>
        ))}
      </ul>

      {history.length > 0 && (
        <div className="mb-8 rounded-xl border border-white/[0.08] bg-surface p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Past attempts
          </p>
          <div className="flex items-end gap-1.5">
            {history.slice(-10).map((attempt, i) => (
              <div key={i} className="flex flex-col items-center gap-1" title={`${attempt.score}%`}>
                <div
                  className="w-4 rounded-t bg-accent-gradient"
                  style={{ height: `${Math.max(4, attempt.score)}px` }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-center">
        <button
          onClick={onStart}
          className="focus-ring rounded-xl bg-accent-gradient px-8 py-3.5 text-base font-semibold text-white shadow-glow transition-transform hover:scale-[1.02]"
        >
          Start the mock exam
        </button>
      </div>
    </div>
  );
}
