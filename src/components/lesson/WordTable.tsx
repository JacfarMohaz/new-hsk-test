"use client";

import { Volume2 } from "lucide-react";
import type { Word } from "@/types/vocabulary";
import { speakChinese, canSpeak } from "@/lib/speech";
import { useHasMounted } from "@/hooks/useHasMounted";

export default function WordTable({
  words,
  hidePinyin,
  hideEnglish,
}: {
  words: Word[];
  hidePinyin: boolean;
  hideEnglish: boolean;
}) {
  const hasMounted = useHasMounted();
  const speechAvailable = hasMounted && canSpeak();

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-surface shadow-card">
      <ul className="divide-y divide-white/[0.06]">
        {words.map((word) => (
          <li
            key={`${word.lessonId}-${word.hanzi}`}
            className="flex flex-wrap items-center gap-3 px-4 py-4 sm:px-6"
          >
            <button
              type="button"
              onClick={() => speakChinese(word.hanzi)}
              disabled={!speechAvailable}
              aria-label={`Play pronunciation of ${word.hanzi}`}
              className="focus-ring flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-bg-deep/60 text-accent-blue transition-colors hover:bg-accent-blue/10 disabled:opacity-40"
            >
              <Volume2 className="h-4 w-4" aria-hidden="true" />
            </button>

            <span className="font-zh w-20 shrink-0 text-2xl font-bold text-ink sm:w-28">
              {word.hanzi}
            </span>

            <span
              className={`w-24 shrink-0 text-sm text-ink-muted transition-opacity sm:w-32 ${
                hidePinyin ? "opacity-0 select-none" : "opacity-100"
              }`}
              aria-hidden={hidePinyin}
            >
              {word.pinyin}
            </span>

            <span className="w-16 shrink-0 rounded-full bg-white/5 px-2 py-0.5 text-center text-xs text-ink-muted">
              {word.pos}
            </span>

            <span
              className={`min-w-[8rem] flex-1 text-sm text-ink transition-opacity ${
                hideEnglish ? "opacity-0 select-none" : "opacity-100"
              }`}
              aria-hidden={hideEnglish}
            >
              {word.en}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
