import type { LessonStatus } from "@/lib/progress";

const STYLES: Record<LessonStatus, string> = {
  "not-started": "bg-white/5 text-ink-muted border-white/10",
  "in-progress": "bg-warning/10 text-warning border-warning/30",
  completed: "bg-success/10 text-success border-success/30",
};

const LABELS: Record<LessonStatus, string> = {
  "not-started": "Not started",
  "in-progress": "In progress",
  completed: "Completed",
};

export default function StatusBadge({ status }: { status: LessonStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${STYLES[status]}`}
    >
      {LABELS[status]}
    </span>
  );
}
