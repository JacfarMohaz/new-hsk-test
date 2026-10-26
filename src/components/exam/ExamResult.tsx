"use client";

import Link from "next/link";
import { CheckCircle2, Home, RotateCcw, Target, XCircle } from "lucide-react";
import type { ExamQuestion, ExamScore } from "@/lib/exam";
import { PART_LABELS } from "@/lib/exam";

function describeQuestion(
  question: ExamQuestion,
  answers: Record<string, unknown>
): { prompt: string; yourAnswer: string; correctAnswer: string; lessonId: number } {
  const answer = answers[question.id];
  switch (question.kind) {
    case "mc":
      return {
        prompt: question.isListening ? `🔊 ${question.word.hanzi} (${question.word.pinyin})` : question.prompt,
        yourAnswer: typeof answer === "number" ? question.options[answer] : "(no answer)",
        correctAnswer: question.options[question.correctIndex],
        lessonId: question.lessonId,
      };
    case "fill":
      return {
        prompt: question.sentence.replace("____", `[ ${question.answerHanzi} ]`),
        yourAnswer: typeof answer === "number" ? question.options[answer] : "(no answer)",
        correctAnswer: question.answerHanzi,
        lessonId: question.lessonId,
      };
    case "order":
      return {
        prompt: question.english,
        yourAnswer: Array.isArray(answer) ? answer.join("") : "(no answer)",
        correctAnswer: question.correctTokens.join(""),
        lessonId: question.lessonId,
      };
    case "typing":
      return {
        prompt: `${question.pinyin} (${question.english})`,
        yourAnswer: typeof answer === "string" && answer.trim() ? answer.trim() : "(no answer)",
        correctAnswer: question.correctHanzi,
        lessonId: question.lessonId,
      };
  }
}

export default function ExamResult({
  score,
  questions,
  answers,
  timeTakenSeconds,
  onRestart,
}: {
  score: ExamScore;
  questions: ExamQuestion[];
  answers: Record<string, unknown>;
  timeTakenSeconds: number;
  onRestart: () => void;
}) {
  const weakestLessons = Object.entries(score.lessonMisses)
    .map(([lessonId, misses]) => ({ lessonId: Number(lessonId), misses }))
    .sort((a, b) => b.misses - a.misses)
    .slice(0, 5);

  const maxMisses = Math.max(1, ...weakestLessons.map((l) => l.misses));
  const minutes = Math.floor(timeTakenSeconds / 60);
  const seconds = timeTakenSeconds % 60;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8 flex flex-col items-center gap-3 rounded-2xl border border-white/[0.08] bg-surface p-8 text-center shadow-card">
        {score.passed ? (
          <CheckCircle2 className="h-14 w-14 text-success" aria-hidden="true" />
        ) : (
          <XCircle className="h-14 w-14 text-error" aria-hidden="true" />
        )}
        <h1 className="text-4xl font-black text-ink">{score.percent}%</h1>
        <p className={`text-sm font-semibold ${score.passed ? "text-success" : "text-error"}`}>
          {score.passed ? "Pass" : "Not a pass yet"} &middot; need 60% to pass
        </p>
        <p className="text-sm text-ink-muted">
          {score.correct} / {score.total} correct &middot; {minutes}m {seconds}s
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {Object.entries(score.sectionScores).map(([part, s]) => (
          <div
            key={part}
            className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-surface p-4"
          >
            <span className="text-sm text-ink">{PART_LABELS[Number(part) as 1 | 2 | 3 | 4 | 5]}</span>
            <span className="text-sm font-semibold text-ink-muted">
              {s.correct}/{s.total}
            </span>
          </div>
        ))}
      </div>

      {weakestLessons.length > 0 && (
        <div className="mb-8 rounded-2xl border border-white/[0.08] bg-surface p-5 shadow-card">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-ink-muted">
            <Target className="h-4 w-4" aria-hidden="true" /> Weakest lessons
          </h2>
          <ul className="space-y-2">
            {weakestLessons.map(({ lessonId, misses }) => (
              <li key={lessonId} className="flex items-center gap-3">
                <span className="w-16 shrink-0 text-xs text-ink-muted">Lesson {lessonId}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-error/70"
                    style={{ width: `${(misses / maxMisses) * 100}%` }}
                  />
                </div>
                <span className="w-16 shrink-0 text-right text-xs text-ink-muted">
                  {misses} missed
                </span>
                <Link
                  href={`/lesson/${lessonId}?tab=quiz`}
                  className="focus-ring rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-ink hover:bg-white/10"
                >
                  Practice
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {score.wrongQuestions.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-muted">
            Review mistakes ({score.wrongQuestions.length})
          </h2>
          <ul className="space-y-2">
            {score.wrongQuestions.map((q) => {
              const d = describeQuestion(q, answers);
              return (
                <li
                  key={q.id}
                  className="rounded-xl border border-white/[0.08] bg-surface p-4 text-sm"
                >
                  <p className="mb-1 text-xs text-ink-muted">
                    Lesson {d.lessonId} &middot; {PART_LABELS[q.part]}
                  </p>
                  <p className="font-zh mb-2 text-base text-ink">{d.prompt}</p>
                  <p className="text-error">Your answer: {d.yourAnswer}</p>
                  <p className="text-success">Correct answer: {d.correctAnswer}</p>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={onRestart}
          className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-ink hover:bg-white/10"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" /> Retake exam
        </button>
        <Link
          href="/"
          className="focus-ring inline-flex items-center gap-1.5 rounded-lg bg-accent-gradient px-4 py-2 text-sm font-semibold text-white shadow-glow"
        >
          <Home className="h-4 w-4" aria-hidden="true" /> Back to home
        </Link>
      </div>
    </div>
  );
}
