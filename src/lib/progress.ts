import type { AppState } from "./storage";

export type LessonStatus = "not-started" | "in-progress" | "completed";

export const COMPLETION_THRESHOLD = 80;

export function getLessonStatus(state: AppState | null, lessonId: number): LessonStatus {
  const progress = state?.lessonProgress[lessonId];
  if (!progress || progress.attempts === 0) return "not-started";
  if (progress.bestScore >= COMPLETION_THRESHOLD) return "completed";
  return "in-progress";
}

export function getOverallProgress(state: AppState | null, totalLessons: number) {
  if (!state) return { completedPercent: 0, averageScore: null as number | null, attemptedCount: 0 };

  const entries = Object.values(state.lessonProgress);
  const attempted = entries.filter((p) => p.attempts > 0);
  const completed = attempted.filter((p) => p.bestScore >= COMPLETION_THRESHOLD);

  const averageScore =
    attempted.length > 0
      ? Math.round(attempted.reduce((sum, p) => sum + p.bestScore, 0) / attempted.length)
      : null;

  return {
    completedPercent: Math.round((completed.length / totalLessons) * 100),
    averageScore,
    attemptedCount: attempted.length,
  };
}
