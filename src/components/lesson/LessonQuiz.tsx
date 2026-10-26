"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Home, RotateCcw, SkipForward, XCircle } from "lucide-react";
import type { Lesson, Word } from "@/types/vocabulary";
import { generateLessonQuiz, type QuizQuestion } from "@/lib/quiz";
import { recordLessonQuizResult } from "@/lib/storage";
import QuestionCard from "@/components/quiz/QuestionCard";
import ProgressBar from "@/components/ui/ProgressBar";

type Stage = "intro" | "running" | "result";

function promptLangFor(type: QuizQuestion["type"]): "zh" | "en" {
  return type === "e2h" || type === "p2h" ? "en" : "zh";
}

export default function LessonQuiz({ lesson }: { lesson: Lesson }) {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("intro");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [mistakes, setMistakes] = useState<Word[]>([]);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [onlyMistakesMode, setOnlyMistakesMode] = useState(false);

  const current = questions[index];

  const startQuiz = useCallback(
    (pool?: Word[]) => {
      const words = pool ?? lesson.words;
      setQuestions(generateLessonQuiz(words));
      setIndex(0);
      setSelected(null);
      setRevealed(false);
      setCorrectCount(0);
      setMistakes([]);
      setStartedAt(Date.now());
      setElapsedSeconds(0);
      setOnlyMistakesMode(!!pool);
      setStage("running");
    },
    [lesson.words]
  );

  useEffect(() => {
    if (stage !== "running" || !startedAt) return;
    const timer = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [stage, startedAt]);

  const finishQuiz = useCallback(
    (finalMistakes: Word[], finalCorrect: number) => {
      const scorePercent = Math.round((finalCorrect / questions.length) * 100);
      if (!onlyMistakesMode) {
        recordLessonQuizResult(lesson.id, scorePercent, finalMistakes);
      }
      setStage("result");
    },
    [lesson.id, questions.length, onlyMistakesMode]
  );

  const handleSelect = useCallback(
    (optionIndex: number) => {
      if (revealed || !current) return;
      setSelected(optionIndex);
      setRevealed(true);
      const isCorrect = optionIndex === current.correctIndex;
      if (isCorrect) {
        setCorrectCount((c) => c + 1);
      } else {
        setMistakes((m) => [...m, current.word]);
      }
    },
    [revealed, current]
  );

  const handleNext = useCallback(() => {
    if (!revealed) return;
    const isLast = index + 1 >= questions.length;
    if (isLast) {
      finishQuiz(mistakes, correctCount);
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
      setRevealed(false);
    }
  }, [revealed, index, questions.length, finishQuiz, mistakes, correctCount]);

  useEffect(() => {
    if (stage !== "running") return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key >= "1" && e.key <= "4") {
        const optionIndex = Number(e.key) - 1;
        if (current && optionIndex < current.options.length) {
          handleSelect(optionIndex);
        }
      } else if (e.key === "Enter") {
        handleNext();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [stage, current, handleSelect, handleNext]);

  const scorePercent = useMemo(
    () => (questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0),
    [correctCount, questions.length]
  );

  if (stage === "intro") {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/[0.08] bg-surface p-8 text-center shadow-card">
        <h2 className="text-xl font-bold text-ink">Lesson {lesson.id} Quiz</h2>
        <p className="max-w-md text-sm text-ink-muted">
          {lesson.words.length} questions covering every word in this lesson. Mixed question
          types, instant feedback, and your best score is saved automatically.
        </p>
        <button
          onClick={() => startQuiz()}
          className="focus-ring rounded-lg bg-accent-gradient px-6 py-3 font-semibold text-white shadow-glow transition-transform hover:scale-[1.02]"
        >
          Start quiz
        </button>
      </div>
    );
  }

  if (stage === "result") {
    const uniqueMistakes = Array.from(
      new Map(mistakes.map((m) => [`${m.lessonId}-${m.hanzi}`, m])).values()
    );

    return (
      <div className="flex flex-col gap-6 rounded-2xl border border-white/[0.08] bg-surface p-6 shadow-card sm:p-8">
        <div className="text-center">
          {scorePercent >= 80 ? (
            <CheckCircle2 className="mx-auto mb-3 h-12 w-12 text-success" aria-hidden="true" />
          ) : (
            <XCircle className="mx-auto mb-3 h-12 w-12 text-warning" aria-hidden="true" />
          )}
          <h2 className="text-2xl font-bold text-ink">{scorePercent}%</h2>
          <p className="text-sm text-ink-muted">
            {correctCount} / {questions.length} correct &middot; {elapsedSeconds}s
          </p>
        </div>

        {uniqueMistakes.length > 0 && (
          <div>
            <h3 className="mb-2 text-sm font-semibold text-ink-muted">Review mistakes</h3>
            <ul className="space-y-2">
              {uniqueMistakes.map((word) => (
                <li
                  key={`${word.lessonId}-${word.hanzi}`}
                  className="flex items-center justify-between rounded-lg border border-white/5 bg-bg-deep/50 px-3 py-2 text-sm"
                >
                  <span className="font-zh text-lg text-ink">{word.hanzi}</span>
                  <span className="text-ink-muted">{word.pinyin}</span>
                  <span className="text-ink-muted">{word.en}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => startQuiz()}
            className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-ink hover:bg-white/10"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" /> Retry
          </button>
          {uniqueMistakes.length > 0 && (
            <button
              onClick={() => startQuiz(uniqueMistakes)}
              className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-ink hover:bg-white/10"
            >
              Retry only mistakes
            </button>
          )}
          {lesson.id < 20 && (
            <button
              onClick={() => router.push(`/lesson/${lesson.id + 1}`)}
              className="focus-ring inline-flex items-center gap-1.5 rounded-lg bg-accent-gradient px-4 py-2 text-sm font-semibold text-white shadow-glow"
            >
              <SkipForward className="h-4 w-4" aria-hidden="true" /> Next lesson
            </button>
          )}
          <button
            onClick={() => router.push("/")}
            className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-ink hover:bg-white/10"
          >
            <Home className="h-4 w-4" aria-hidden="true" /> Back to home
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
