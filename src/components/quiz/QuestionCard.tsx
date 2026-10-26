"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Ear, Volume2, X } from "lucide-react";
import { canSpeak, speakChinese } from "@/lib/speech";
import { useHasMounted } from "@/hooks/useHasMounted";

export interface QuestionCardProps {
  prompt: string;
  promptLang?: "zh" | "en";
  isListening?: boolean;
  spokenText?: string;
  optionsLang?: "zh" | "en";
  options: string[];
  selectedIndex: number | null;
  correctIndex: number;
  revealed: boolean;
  onSelect: (index: number) => void;
  questionNumber?: number;
  totalQuestions?: number;
}

export default function QuestionCard({
  prompt,
  promptLang = "zh",
  isListening = false,
  spokenText,
  optionsLang,
  options,
  selectedIndex,
  correctIndex,
  revealed,
  onSelect,
  questionNumber,
  totalQuestions,
}: QuestionCardProps) {
  const spokenOnMount = useRef<string | null>(null);
  const hasMounted = useHasMounted();
  const speechAvailable = hasMounted && canSpeak();
  const [textRevealed, setTextRevealed] = useState(false);

  useEffect(() => {
    if (isListening && spokenText && spokenOnMount.current !== spokenText) {
      spokenOnMount.current = spokenText;
      speakChinese(spokenText);
    }
  }, [isListening, spokenText]);

  const resolvedOptionsLang = optionsLang ?? (isListening ? "zh" : promptLang === "zh" ? "en" : "zh");
  // Audio can be unreliable (unsupported browser, blocked autoplay, sandboxed
  // environments), so once mounted we either auto-show the character as text
  // when speech isn't supported at all, or offer a manual fallback toggle.
  const showTextFallback = isListening && hasMounted && (!speechAvailable || textRevealed);

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-surface p-5 shadow-card sm:p-8">
      {questionNumber && totalQuestions && (
        <p className="mb-4 text-xs font-medium uppercase tracking-wide text-ink-muted">
          Question {questionNumber} of {totalQuestions}
        </p>
      )}

      <div className="mb-6 flex min-h-[4rem] flex-col items-center justify-center gap-3 text-center">
        {isListening ? (
          <>
            <button
              type="button"
              onClick={() => spokenText && speakChinese(spokenText)}
              aria-label="Replay pronunciation"
              className="focus-ring flex items-center gap-2 rounded-full bg-accent-gradient px-5 py-3 font-semibold text-white shadow-glow transition-transform hover:scale-105"
            >
              <Volume2 className="h-5 w-5" aria-hidden="true" />
              Replay
            </button>

            {showTextFallback ? (
              <p className="font-zh text-4xl font-bold text-ink sm:text-5xl">{spokenText}</p>
            ) : (
              <button
                type="button"
                onClick={() => setTextRevealed(true)}
                className="focus-ring flex items-center gap-1.5 text-xs text-ink-muted underline-offset-2 hover:text-ink hover:underline"
              >
                <Ear className="h-3.5 w-3.5" aria-hidden="true" />
                Can&apos;t hear it? Show the character
              </button>
            )}
            {!speechAvailable && hasMounted && (
              <p className="text-xs text-ink-muted">
                Audio isn&apos;t supported in this browser, so the character is shown instead.
              </p>
            )}
          </>
        ) : (
          <p
            className={
              promptLang === "zh"
                ? "font-zh text-4xl font-bold text-ink sm:text-5xl"
                : "text-xl font-semibold text-ink sm:text-2xl"
            }
          >
            {prompt}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2" role="group" aria-label="Answer options">
        {options.map((option, index) => {
          const isSelected = selectedIndex === index;
          const isCorrectOption = index === correctIndex;
          let stateClasses =
            "border-white/10 bg-bg-deep/60 hover:border-accent-blue/40 hover:bg-white/5";

          if (revealed) {
            if (isCorrectOption) {
              stateClasses = "border-success/60 bg-success/10 text-success";
            } else if (isSelected) {
              stateClasses = "border-error/60 bg-error/10 text-error";
            } else {
              stateClasses = "border-white/5 bg-bg-deep/40 opacity-60";
            }
          } else if (isSelected) {
            stateClasses = "border-accent-blue/60 bg-accent-blue/10";
          }

          return (
            <button
              key={`${option}-${index}`}
              type="button"
              disabled={revealed}
              onClick={() => onSelect(index)}
              className={`focus-ring flex items-center justify-between gap-2 rounded-xl border px-4 py-3 text-left transition-colors ${stateClasses}`}
            >
              <span className="flex items-center gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/20 text-xs text-ink-muted">
                  {index + 1}
                </span>
                <span className={resolvedOptionsLang === "zh" ? "font-zh text-lg" : "text-sm"}>
                  {option}
                </span>
              </span>
              {revealed && isCorrectOption && <Check className="h-5 w-5 text-success" aria-hidden="true" />}
              {revealed && isSelected && !isCorrectOption && (
                <X className="h-5 w-5 text-error" aria-hidden="true" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
