"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Flag, PlayCircle, RotateCcw } from "lucide-react";

export default function StartPointSelector({
  totalLessons,
  lastOpenedLesson,
}: {
  totalLessons: number;
  lastOpenedLesson: number | null;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState(1);

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-surface p-5 shadow-card">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-ink-muted">
        Start point
      </h2>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label htmlFor="lesson-select" className="text-sm text-ink-muted sm:sr-only">
          Start from lesson
        </label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-ink-muted">Start from lesson:</span>
          <select
            id="lesson-select"
            value={selected}
            onChange={(e) => setSelected(Number(e.target.value))}
            className="focus-ring rounded-lg border border-white/10 bg-bg-deep px-3 py-2 text-sm text-ink"
          >
            {Array.from({ length: totalLessons }, (_, i) => i + 1).map((id) => (
              <option key={id} value={id}>
                Lesson {id}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => router.push(`/lesson/${selected}`)}
          className="focus-ring inline-flex items-center justify-center gap-1.5 rounded-lg bg-accent-gradient px-4 py-2 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.02]"
        >
          Go <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => router.push("/lesson/1")}
          className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-ink hover:bg-white/10"
        >
          <PlayCircle className="h-4 w-4 text-accent-blue" aria-hidden="true" />
          Start from Lesson 1
        </button>
        <button
          onClick={() => router.push(`/lesson/${lastOpenedLesson ?? 1}`)}
          className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-ink hover:bg-white/10"
        >
          <RotateCcw className="h-4 w-4 text-accent-purple" aria-hidden="true" />
          Continue where I left off
          {lastOpenedLesson && <span className="text-ink-muted">(Lesson {lastOpenedLesson})</span>}
        </button>
        <button
          onClick={() => router.push("/exam")}
          className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-ink hover:bg-white/10"
        >
          <Flag className="h-4 w-4 text-warning" aria-hidden="true" />
          Jump to Final Exam
        </button>
      </div>
    </div>
  );
}
