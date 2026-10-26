"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Volume2 } from "lucide-react";
import type { Word } from "@/types/vocabulary";
import { speakChinese } from "@/lib/speech";

export default function FlashCards({ words }: { words: Word[] }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const word = words[index];

  function goTo(nextIndex: number) {
    const wrapped = (nextIndex + words.length) % words.length;
    setIndex(wrapped);
    setFlipped(false);
  }

  if (!word) return null;

  return (
    <div className="flex flex-col items-center gap-5">
      <p className="text-sm text-ink-muted">
        Card {index + 1} / {words.length}
      </p>

      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-label="Flip card"
        className="focus-ring relative h-56 w-full max-w-sm rounded-2xl"
        style={{ perspective: "1200px" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={flipped ? "back" : "front"}
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex h-56 w-full flex-col items-center justify-center gap-2 rounded-2xl border border-white/[0.08] bg-surface p-6 shadow-card"
          >
            {flipped ? (
              <>
                <span className="text-sm text-ink-muted">{word.pinyin}</span>
                <span className="text-lg font-semibold text-ink">{word.en}</span>
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-ink-muted">
                  {word.pos}
                </span>
              </>
            ) : (
              <span className="font-zh text-5xl font-bold text-ink">{word.hanzi}</span>
            )}
          </motion.div>
        </AnimatePresence>
      </button>

      <div className="flex items-center gap-3">
        <button
          onClick={() => goTo(index - 1)}
          aria-label="Previous card"
          className="focus-ring flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-ink hover:bg-white/10"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          onClick={() => speakChinese(word.hanzi)}
          aria-label="Play pronunciation"
          className="focus-ring flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-accent-blue hover:bg-white/10"
        >
          <Volume2 className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          onClick={() => goTo(index + 1)}
          aria-label="Next card"
          className="focus-ring flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-ink hover:bg-white/10"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
