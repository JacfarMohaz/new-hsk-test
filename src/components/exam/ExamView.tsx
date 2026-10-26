"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Flag } from "lucide-react";
import { useAppState } from "@/hooks/useAppState";
import {
  EXAM_CONFIG,
  generateExam,
  scoreExam,
  type ExamQuestion,
} from "@/lib/exam";
import { recordExamAttempt } from "@/lib/storage";
import QuestionCard from "@/components/quiz/QuestionCard";
import ExamIntro from "@/components/exam/ExamIntro";
import ExamTimer from "@/components/exam/ExamTimer";
import ExamNavigator from "@/components/exam/ExamNavigator";
import FillBlankQuestion from "@/components/exam/FillBlankQuestion";
import OrderQuestion from "@/components/exam/OrderQuestion";
import TypingQuestion from "@/components/exam/TypingQuestion";
import SubmitDialog from "@/components/exam/SubmitDialog";
import ExamResult from "@/components/exam/ExamResult";

type Stage = "intro" | "running" | "result";

function promptLangForMc(question: Extract<ExamQuestion, { kind: "mc" }>): "zh" | "en" {
  if (question.isListening) return "zh";
  // h2e / h2p prompts are hanzi; e2h / p2h-derived prompts are latin text.
  return /[一-鿿]/.test(question.prompt) ? "zh" : "en";
}

export default function ExamView() {
  const { state, refresh, loaded } = useAppState();
  const [stage, setStage] = useState<Stage>("intro");
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(EXAM_CONFIG.durationMinutes * 60);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [score, setScore] = useState<ReturnType<typeof scoreExam> | null>(null);
  const [timeTakenSeconds, setTimeTakenSeconds] = useState(0);

  const current = questions[currentIndex];

  const startExam = useCallback(() => {
    setQuestions(generateExam());
    setAnswers({});
    setFlagged(new Set());
    setCurrentIndex(0);
    setRemainingSeconds(EXAM_CONFIG.durationMinutes * 60);
    setScore(null);
    setStage("running");
  }, []);

  const handleSubmit = useCallback(() => {
    const finalScore = scoreExam(questions, answers);
    const elapsed = EXAM_CONFIG.durationMinutes * 60 - remainingSeconds;
    setScore(finalScore);
    setTimeTakenSeconds(elapsed);

    const sectionScores: Record<string, number> = {};
    for (const [part, sec] of Object.entries(finalScore.sectionScores)) {
      sectionScores[part] = sec.total > 0 ? Math.round((sec.correct / sec.total) * 100) : 0;
    }
    recordExamAttempt({
      date: new Date().toISOString(),
      score: finalScore.percent,
      sectionScores,
      lessonMisses: finalScore.lessonMisses,
    });
    refresh();

    setShowSubmitDialog(false);
    setStage("result");
  }, [questions, answers, remainingSeconds, refresh]);

  useEffect(() => {
    if (stage !== "running") return;
    const timer = setInterval(() => {
      setRemainingSeconds((s) => {
        if (s <= 1) {
          clearInterval(timer);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [stage]);

  useEffect(() => {
    if (stage === "running" && remainingSeconds === 0) {
      // Auto-submit when the countdown reaches zero; handleSubmit flips `stage`
      // away from "running" immediately, so this can't re-fire on its own effect.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      handleSubmit();
    }
  }, [stage, remainingSeconds, handleSubmit]);

  function setAnswer(questionId: string, value: unknown) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  function toggleFlag(questionId: string) {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      return next;
    });
  }

  const unansweredCount = useMemo(
    () => questions.filter((q) => answers[q.id] === undefined).length,
    [questions, answers]
  );

  if (!loaded) return null;

  if (stage === "intro") {
    return <ExamIntro history={state?.examHistory ?? []} onStart={startExam} />;
  }

  if (stage === "result" && score) {
    return (
      <ExamResult
        score={score}
        questions={questions}
        answers={answers}
        timeTakenSeconds={timeTakenSeconds}
        onRestart={startExam}
      />
    );
  }

  if (!current) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-bold text-ink">Final HSK 3 Mock Exam</h1>
        <div className="flex items-center gap-2">
          <ExamTimer remainingSeconds={remainingSeconds} />
          <button
            onClick={() => setShowSubmitDialog(true)}
            className="focus-ring rounded-lg bg-accent-gradient px-4 py-1.5 text-sm font-semibold text-white shadow-glow"
          >
            Submit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between text-xs text-ink-muted">
            <span>
              Question {currentIndex + 1} of {questions.length} &middot; Lesson {current.lessonId}
            </span>
            <button
              onClick={() => toggleFlag(current.id)}
              aria-pressed={flagged.has(current.id)}
              className={`focus-ring inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 ${
                flagged.has(current.id)
                  ? "border-warning/40 bg-warning/10 text-warning"
                  : "border-white/10 bg-white/5 text-ink-muted hover:bg-white/10"
              }`}
            >
              <Flag className="h-3.5 w-3.5" aria-hidden="true" /> Flag
            </button>
          </div>

          {current.kind === "mc" && (
            <QuestionCard
              key={current.id}
              prompt={current.prompt}
              promptLang={promptLangForMc(current)}
              isListening={current.isListening}
              spokenText={current.spokenText}
              options={current.options}
              selectedIndex={typeof answers[current.id] === "number" ? (answers[current.id] as number) : null}
              correctIndex={current.correctIndex}
              revealed={false}
              onSelect={(i) => setAnswer(current.id, i)}
            />
          )}
          {current.kind === "fill" && (
            <FillBlankQuestion
              question={current}
              selected={typeof answers[current.id] === "number" ? (answers[current.id] as number) : null}
              onSelect={(i) => setAnswer(current.id, i)}
            />
          )}
          {current.kind === "order" && (
            <OrderQuestion
              question={current}
              answer={answers[current.id] as string[] | undefined}
              onChange={(tokens) => setAnswer(current.id, tokens)}
            />
          )}
          {current.kind === "typing" && (
            <TypingQuestion
              question={current}
              value={(answers[current.id] as string) ?? ""}
              onChange={(v) => setAnswer(current.id, v)}
            />
          )}

          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              disabled={currentIndex === 0}
              className="focus-ring inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-ink hover:bg-white/10 disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Previous
            </button>
            <button
              onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
              disabled={currentIndex === questions.length - 1}
              className="focus-ring inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-ink hover:bg-white/10 disabled:opacity-30"
            >
              Next <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <aside>
          <ExamNavigator
            questions={questions}
            currentIndex={currentIndex}
            answers={answers}
            flagged={flagged}
            onJump={setCurrentIndex}
          />
        </aside>
      </div>

      {showSubmitDialog && (
        <SubmitDialog
          unansweredCount={unansweredCount}
          onConfirm={handleSubmit}
          onCancel={() => setShowSubmitDialog(false)}
        />
      )}
    </div>
  );
}
