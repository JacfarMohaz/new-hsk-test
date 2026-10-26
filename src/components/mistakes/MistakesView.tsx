"use client";

import { useState } from "react";
import { AlertTriangle, BookOpen } from "lucide-react";
import { useAppState } from "@/hooks/useAppState";
import MistakePractice from "@/components/mistakes/MistakePractice";

const MIN_WORDS_FOR_QUIZ = 4;

export default function MistakesView() {
  const { state, refresh, loaded } = useAppState();
  const [practicing, setPracticing] = useState(false);

  if (!loaded) return null;

  const mistakes = state?.mistakeBank ?? [];

  if (practicing) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <MistakePractice
          words={mistakes}
          onExit={() => {
            setPracticing(false);
            refresh();
          }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-6">
        <h1 className="text-3xl font-black text-ink">Mistakes</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Words you&apos;ve gotten wrong in any lesson quiz or the final exam.
        </p>
      </header>

      <div className="mb-6 flex items-start gap-3 rounded-xl border border-warning/30 bg-warning/10 p-4 text-sm text-warning">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <p>
          Unlike every lesson page, this list mixes words from <strong>multiple lessons</strong>{" "}
          together &mdash; the final exam does this too, but lesson study/quiz pages never do.
        </p>
      </div>

      {mistakes.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.08] bg-surface p-8 text-center text-ink-muted shadow-card">
          No mistakes recorded yet. Nice work!
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-ink-muted">{mistakes.length} word(s) to review</p>
            <button
              onClick={() => setPracticing(true)}
              disabled={mistakes.length < MIN_WORDS_FOR_QUIZ}
              className="focus-ring inline-flex items-center gap-1.5 rounded-lg bg-accent-gradient px-4 py-2 text-sm font-semibold text-white shadow-glow disabled:cursor-not-allowed disabled:opacity-40"
            >
              <BookOpen className="h-4 w-4" aria-hidden="true" /> Practice mistakes
            </button>
          </div>
          {mistakes.length < MIN_WORDS_FOR_QUIZ && (
            <p className="mb-4 text-xs text-ink-muted">
              Need at least {MIN_WORDS_FOR_QUIZ} mistakes to generate a practice quiz.
            </p>
          )}

          <ul className="divide-y divide-white/[0.06] overflow-hidden rounded-2xl border border-white/[0.08] bg-surface shadow-card">
            {mistakes.map((word) => (
              <li
                key={`${word.lessonId}-${word.hanzi}`}
                className="flex flex-wrap items-center gap-3 px-4 py-4 sm:px-6"
              >
                <span className="font-zh w-20 shrink-0 text-2xl font-bold text-ink">
                  {word.hanzi}
                </span>
                <span className="w-24 shrink-0 text-sm text-ink-muted">{word.pinyin}</span>
                <span className="flex-1 text-sm text-ink">{word.en}</span>
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-ink-muted">
                  Lesson {word.lessonId}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
