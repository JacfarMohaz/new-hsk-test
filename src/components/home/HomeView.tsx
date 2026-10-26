"use client";

import { useAppState } from "@/hooks/useAppState";
import { getAllLessons, TOTAL_LESSONS } from "@/data";
import { getLessonStatus, getOverallProgress } from "@/lib/progress";
import ProgressBar from "@/components/ui/ProgressBar";
import LessonCard from "@/components/home/LessonCard";
import FinalExamCard from "@/components/home/FinalExamCard";
import StartPointSelector from "@/components/home/StartPointSelector";

export default function HomeView() {
  const { state, loaded } = useAppState();
  const lessons = getAllLessons();
  const { completedPercent, averageScore } = getOverallProgress(state, TOTAL_LESSONS);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <section className="mb-10 rounded-3xl border border-white/[0.08] bg-surface p-6 shadow-card sm:p-10">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent-blue">
          HSK 3 Sprint
        </p>
        <h1 className="mb-3 text-3xl font-black tracking-tight text-ink sm:text-4xl">
          Master HSK 3 vocabulary, one lesson at a time.
        </h1>
        <p className="mb-6 max-w-2xl text-ink-muted">
          20 isolated lessons, mixed-type quizzes, and a full-length mock exam &mdash; everything
          saved right in your browser. No sign-up, no clutter.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-white/[0.08] bg-bg-deep/60 p-4">
            <ProgressBar
              value={loaded ? completedPercent : 0}
              label={`Lessons completed (${lessons.length})`}
            />
          </div>
          <div className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-bg-deep/60 p-4">
            <span className="text-sm text-ink-muted">Average quiz score</span>
            <span className="text-xl font-bold text-ink">
              {loaded && averageScore !== null ? `${averageScore}%` : "—"}
            </span>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <StartPointSelector
          totalLessons={TOTAL_LESSONS}
          lastOpenedLesson={state?.lastOpenedLesson ?? null}
        />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-bold text-ink">All lessons</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FinalExamCard history={state?.examHistory ?? []} />
          {lessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              status={loaded ? getLessonStatus(state, lesson.id) : "not-started"}
              bestScore={state?.lessonProgress[lesson.id]?.bestScore ?? null}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
