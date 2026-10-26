"use client";

import type { ExamFillBlankQuestion } from "@/lib/exam";

export default function FillBlankQuestion({
  question,
  selected,
  onSelect,
}: {
  question: ExamFillBlankQuestion;
  selected: number | null;
  onSelect: (index: number) => void;
}) {
  const [before, after] = question.sentence.split("____");

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-surface p-5 shadow-card sm:p-8">
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-muted">
        Fill in the blank
      </p>
      <p className="font-zh mb-2 text-center text-2xl font-bold leading-relaxed text-ink sm:text-3xl">
        {before}
        <span className="mx-1 inline-block min-w-[2.5rem] rounded-md border-b-2 border-accent-blue text-accent-blue">
          {selected !== null ? question.options[selected] : "____"}
        </span>
        {after}
      </p>
      <p className="mb-6 text-center text-sm text-ink-muted">{question.english}</p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {question.options.map((option, index) => (
          <button
            key={`${option}-${index}`}
            type="button"
            onClick={() => onSelect(index)}
            className={`focus-ring font-zh rounded-xl border px-4 py-3 text-lg transition-colors ${
              selected === index
                ? "border-accent-blue/60 bg-accent-blue/10 text-ink"
                : "border-white/10 bg-bg-deep/60 text-ink hover:border-accent-blue/40 hover:bg-white/5"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
