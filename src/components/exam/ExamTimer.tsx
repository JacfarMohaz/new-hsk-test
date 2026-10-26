"use client";

import { Clock } from "lucide-react";

export default function ExamTimer({ remainingSeconds }: { remainingSeconds: number }) {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const isLow = remainingSeconds <= 5 * 60;

  return (
    <div
      role="timer"
      aria-live="polite"
      className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-semibold tabular-nums ${
        isLow ? "border-error/40 bg-error/10 text-error" : "border-white/10 bg-white/5 text-ink"
      }`}
    >
      <Clock className="h-4 w-4" aria-hidden="true" />
      {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
    </div>
  );
}
