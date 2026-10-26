"use client";

import { useMemo } from "react";
import { RotateCcw } from "lucide-react";
import type { ExamOrderQuestion } from "@/lib/exam";

/** Reconstructs which shuffledTokens indices are "used" from a saved tokens-by-value answer. */
function resolveChosenIndices(shuffledTokens: string[], chosenValues: string[]): number[] {
  const used = new Set<number>();
  const indices: number[] = [];
  for (const value of chosenValues) {
    const found = shuffledTokens.findIndex((t, i) => t === value && !used.has(i));
    if (found === -1) continue;
    used.add(found);
    indices.push(found);
  }
  return indices;
}

export default function OrderQuestion({
  question,
  answer,
  onChange,
}: {
  question: ExamOrderQuestion;
  answer: string[] | undefined;
  onChange: (tokens: string[]) => void;
}) {
  const chosenIndices = useMemo(
    () => resolveChosenIndices(question.shuffledTokens, answer ?? []),
    [question.shuffledTokens, answer]
  );
  const chosenSet = new Set(chosenIndices);

  function appendToken(tokenIndex: number) {
    const next = [...chosenIndices, tokenIndex].map((i) => question.shuffledTokens[i]);
    onChange(next);
  }

  function removeAt(position: number) {
    const next = chosenIndices
      .filter((_, i) => i !== position)
      .map((i) => question.shuffledTokens[i]);
    onChange(next);
  }

  function reset() {
    onChange([]);
  }

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-surface p-5 shadow-card sm:p-8">
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-muted">
        Put the sentence in order
      </p>
      <p className="mb-6 text-center text-sm text-ink-muted">{question.english}</p>

      <div className="mb-4 flex min-h-[3.5rem] flex-wrap items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-bg-deep/40 p-3">
        {chosenIndices.length === 0 && (
          <span className="text-sm text-ink-muted">Tap the pieces below in order&hellip;</span>
        )}
        {chosenIndices.map((tokenIndex, position) => (
          <button
            key={`${tokenIndex}-${position}`}
            type="button"
            onClick={() => removeAt(position)}
            className="focus-ring font-zh rounded-lg border border-accent-blue/40 bg-accent-blue/10 px-3 py-2 text-lg text-ink"
          >
            {question.shuffledTokens[tokenIndex]}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {question.shuffledTokens.map((token, index) => (
          <button
            key={index}
            type="button"
            disabled={chosenSet.has(index)}
            onClick={() => appendToken(index)}
            className={`focus-ring font-zh rounded-lg border px-3 py-2 text-lg transition-opacity ${
              chosenSet.has(index)
                ? "border-white/5 bg-bg-deep/30 text-ink-muted opacity-30"
                : "border-white/10 bg-bg-deep/60 text-ink hover:border-accent-blue/40 hover:bg-white/5"
            }`}
          >
            {token}
          </button>
        ))}
      </div>

      {chosenIndices.length > 0 && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={reset}
            className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-ink-muted hover:bg-white/10"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Reset
          </button>
        </div>
      )}
    </div>
  );
}
