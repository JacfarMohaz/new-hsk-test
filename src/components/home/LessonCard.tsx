"use client";

import Link from "next/link";
import type { Lesson } from "@/types/vocabulary";
import type { LessonStatus } from "@/lib/progress";
import StatusBadge from "@/components/ui/Badge";

export default function LessonCard({
  lesson,
  status,
  bestScore,
}: {
  lesson: Lesson;
  status: LessonStatus;
  bestScore: number | null;
}) {
  return (
    <Link
      href={`/lesson/${lesson.id}`}
      className="focus-ring group relative flex flex-col gap-3 rounded-2xl border border-white/[0.08] bg-surface p-4 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-blue/40 hover:shadow-glow"
    >
      <div className="flex items-center justify-between">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-sm font-bold text-ink-muted group-hover:bg-accent-gradient group-hover:text-white">
          {lesson.id}
        </span>
        <StatusBadge status={status} />
      </div>
      <div>
        <h3 className="font-zh text-lg font-bold leading-snug text-ink">{lesson.titleZh}</h3>
        <p className="text-sm text-ink-muted">{lesson.titleEn}</p>
      </div>
      <div className="mt-auto flex items-center justify-between text-xs text-ink-muted">
        <span>{lesson.words.length} words</span>
        <span>{bestScore !== null ? `Best: ${bestScore}%` : "No attempts yet"}</span>
      </div>
    </Link>
  );
}
