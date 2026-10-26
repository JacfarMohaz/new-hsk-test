"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Eye, EyeOff, LayoutGrid, Rows3 } from "lucide-react";
import type { Lesson } from "@/types/vocabulary";
import { setLastOpenedLesson } from "@/lib/storage";
import { useAppState } from "@/hooks/useAppState";
import WordTable from "@/components/lesson/WordTable";
import FlashCards from "@/components/lesson/FlashCards";
import LessonQuiz from "@/components/lesson/LessonQuiz";

type Tab = "study" | "quiz";
type StudyMode = "table" | "flashcards";

export default function LessonView({ lesson, totalLessons }: { lesson: Lesson; totalLessons: number }) {
  const searchParams = useSearchParams();
  const initialTab: Tab = searchParams.get("tab") === "quiz" ? "quiz" : "study";
  const [tab, setTab] = useState<Tab>(initialTab);
  const [studyMode, setStudyMode] = useState<StudyMode>("table");
  const { state, update } = useAppState();

  useEffect(() => {
    setLastOpenedLesson(lesson.id);
  }, [lesson.id]);

  const hidePinyin = state?.settings.hidePinyinDefault ?? false;
  const hideEnglish = state?.settings.hideEnglishDefault ?? false;

  function toggleHidePinyin() {
    update((s) => ({ ...s, settings: { ...s.settings, hidePinyinDefault: !s.settings.hidePinyinDefault } }));
  }
  function toggleHideEnglish() {
    update((s) => ({ ...s, settings: { ...s.settings, hideEnglishDefault: !s.settings.hideEnglishDefault } }));
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-6 flex items-center justify-between gap-2">
        <Link
          href={lesson.id > 1 ? `/lesson/${lesson.id - 1}` : "#"}
          aria-disabled={lesson.id <= 1}
          className={`focus-ring flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm ${
            lesson.id <= 1 ? "pointer-events-none opacity-30" : "text-ink hover:bg-white/10"
          }`}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Prev
        </Link>
        <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">
          Lesson {lesson.id} of {totalLessons}
        </p>
        <Link
          href={lesson.id < totalLessons ? `/lesson/${lesson.id + 1}` : "#"}
          aria-disabled={lesson.id >= totalLessons}
          className={`focus-ring flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm ${
            lesson.id >= totalLessons ? "pointer-events-none opacity-30" : "text-ink hover:bg-white/10"
          }`}
        >
          Next <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <header className="mb-8 text-center">
        <h1 className="font-zh text-3xl font-black text-ink">{lesson.titleZh}</h1>
        <p className="mt-1 text-ink-muted">{lesson.titleEn}</p>
      </header>

      <div
        role="tablist"
        aria-label="Lesson sections"
        className="mb-6 flex gap-2 rounded-xl border border-white/[0.08] bg-surface p-1"
      >
        {(["study", "quiz"] as const).map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`focus-ring flex-1 rounded-lg px-4 py-2 text-sm font-semibold capitalize transition-colors ${
              tab === t ? "bg-accent-gradient text-white shadow-glow" : "text-ink-muted hover:text-ink"
            }`}
          >
            {t === "study" ? "Study" : "Quiz"}
          </button>
        ))}
      </div>

      {tab === "study" ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2">
              <button
                onClick={() => setStudyMode("table")}
                aria-pressed={studyMode === "table"}
                className={`focus-ring flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-sm ${
                  studyMode === "table" ? "bg-white/10 text-ink" : "text-ink-muted hover:bg-white/5"
                }`}
              >
                <Rows3 className="h-4 w-4" aria-hidden="true" /> Table
              </button>
              <button
                onClick={() => setStudyMode("flashcards")}
                aria-pressed={studyMode === "flashcards"}
                className={`focus-ring flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-sm ${
                  studyMode === "flashcards" ? "bg-white/10 text-ink" : "text-ink-muted hover:bg-white/5"
                }`}
              >
                <LayoutGrid className="h-4 w-4" aria-hidden="true" /> Flashcards
              </button>
            </div>

            {studyMode === "table" && (
              <div className="flex gap-2">
                <button
                  onClick={toggleHidePinyin}
                  aria-pressed={hidePinyin}
                  className="focus-ring flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-sm text-ink-muted hover:bg-white/5"
                >
                  {hidePinyin ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                  Pinyin
                </button>
                <button
                  onClick={toggleHideEnglish}
                  aria-pressed={hideEnglish}
                  className="focus-ring flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-sm text-ink-muted hover:bg-white/5"
                >
                  {hideEnglish ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                  English
                </button>
              </div>
            )}
          </div>

          {studyMode === "table" ? (
            <WordTable words={lesson.words} hidePinyin={hidePinyin} hideEnglish={hideEnglish} />
          ) : (
            <FlashCards words={lesson.words} />
          )}
        </div>
      ) : (
        <LessonQuiz lesson={lesson} />
      )}
    </div>
  );
}
