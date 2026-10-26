"use client";

import type { ExamTypingQuestion } from "@/lib/exam";

export default function TypingQuestion({
  question,
  value,
  onChange,
}: {
  question: ExamTypingQuestion;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-surface p-5 shadow-card sm:p-8">
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-muted">
        Type the hanzi
      </p>
      <div className="mb-6 text-center">
        <p className="text-2xl font-semibold text-ink">{question.pinyin}</p>
        <p className="mt-1 text-sm text-ink-muted">{question.english}</p>
      </div>
      <label htmlFor={`typing-${question.id}`} className="sr-only">
        Type the hanzi for {question.pinyin}
      </label>
      <input
        id={`typing-${question.id}`}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="输入汉字"
        className="focus-ring font-zh mx-auto block w-full max-w-xs rounded-xl border border-white/10 bg-bg-deep/60 px-4 py-3 text-center text-3xl text-ink"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
      />
    </div>
  );
}
