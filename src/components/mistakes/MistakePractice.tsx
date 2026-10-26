"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Home, RotateCcw } from "lucide-react";
import type { Word } from "@/types/vocabulary";
import { generateLessonQuiz, type QuizQuestion } from "@/lib/quiz";
import { clearMistake } from "@/lib/storage";
import QuestionCard from "@/components/quiz/QuestionCard";
import ProgressBar from "@/components/ui/ProgressBar";

function promptLangFor(type: QuizQuestion["type"]): "zh" | "en" {
  return type === "e2h" || type === "p2h" ? "en" : "zh";
}

export default function MistakePractice({
  words,
  onExit,
}: {
  words: Word[];
  onExit: () => void;
}) {
  const [questions, setQuestions] = useState<QuizQuestion[]>(() => generateLessonQuiz(words));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);

  const current = questions[index];

  const handleSelect = useCallback(
    (optionIndex: number) => {
      if (revealed || !current) return;
      setSelected(optionIndex);
      setRevealed(true);
      if (optionIndex === current.correctIndex) {
        setCorrectCount((c) => c + 1);
        clearMistake(current.word);
      }
    },
    [revealed, current]
  );

  const handleNext = useCallback(() => {
    if (!revealed) return;
    if (index + 1 >= questions.length) {
      setDone(true);
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
      setRevealed(false);
    }
  }, [revealed, index, questions.length]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (done) return;
      if (e.key >= "1" && e.key <= "4") {
        const optionIndex = Number(e.key) - 1;
        if (current && optionIndex < current.options.length) handleSelect(optionIndex);
      } else if (e.key === "Enter") {
        handleNext();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [current, handleSelect, handleNext, done]);

  if (done) {
    const percent = Math.round((correctCount / questions.length) * 100);
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/[0.08] bg-surface p-8 text-center shadow-card">
        <CheckCircle2 className="h-12 w-12 text-success" aria-hidden="true" />
        <h2 className="text-2xl font-bold text-ink">{percent}%</h2>
        <p className="text-sm text-ink-muted">
          {correctCount} / {questions.length} correct. Words you got right were removed from your
          mistake bank.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setQuestions(generateLessonQuiz(words));
              setIndex(0);
              setSelected(null);
              setRevealed(false);
              setCorrectCount(0);
              setDone(false);
            }}
            className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-ink hover:bg-white/10"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" /> Practice again
          </button>
          <button
            onClick={onExit}
            className="focus-ring inline-flex items-center gap-1.5 rounded-lg bg-accent-gradient px-4 py-2 text-sm font-semibold text-white shadow-glow"
          >
            <Home className="h-4 w-4" aria-hidden="true" /> Done
          </button>
        </div>
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className="flex flex-col gap-4">
      <ProgressBar value={((index + (revealed ? 1 : 0)) / questions.length) * 100} />
      <QuestionCard
        key={current.id}
        prompt={current.prompt}
        promptLang={promptLangFor(current.type)}
        isListening={current.type === "listen"}
        spokenText={current.type === "listen" ? current.word.hanzi : undefined}
        options={current.options}
        selectedIndex={selected}
        correctIndex={current.correctIndex}
        revealed={revealed}
        onSelect={handleSelect}
        questionNumber={index + 1}
        totalQuestions={questions.length}
      />
      <div className="flex items-center justify-between text-xs text-ink-muted">
        <span>Keys 1-4 to answer &middot; Enter for next</span>
        {revealed && (
          <button
            onClick={handleNext}
            className="focus-ring rounded-lg bg-accent-gradient px-4 py-2 text-sm font-semibold text-white shadow-glow"
          >
            {index + 1 >= questions.length ? "See results" : "Next"}
          </button>
        )}
      </div>
    </div>
  );
}
