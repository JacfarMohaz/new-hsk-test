import type { Word } from "@/types/vocabulary";
import { shuffle } from "./shuffle";

export type QuestionType = "h2e" | "e2h" | "h2p" | "p2h" | "listen";

export const ALL_QUESTION_TYPES: QuestionType[] = ["h2e", "e2h", "h2p", "p2h", "listen"];

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  word: Word;
  /** The text to display as the prompt (not used for "listen", which speaks word.hanzi). */
  prompt: string;
  options: string[];
  correctIndex: number;
}

interface BuildOptionsParams {
  word: Word;
  pool: Word[];
  field: "hanzi" | "pinyin" | "en";
  optionCount: number;
  random: () => number;
}

/**
 * Builds a 4-option set for a word, drawing distractors only from `pool` (same lesson),
 * never reusing a distractor with the same hanzi or english meaning as the correct word.
 */
function buildOptions({ word, pool, field, optionCount, random }: BuildOptionsParams): {
  options: string[];
  correctIndex: number;
} {
  const candidates = pool.filter(
    (w) => w.hanzi !== word.hanzi && w.en !== word.en
  );

  const seenValues = new Set<string>([word[field]]);
  const distractorPool = shuffle(candidates, random);
  const distractors: string[] = [];

  for (const candidate of distractorPool) {
    const value = candidate[field];
    if (seenValues.has(value)) continue;
    seenValues.add(value);
    distractors.push(value);
    if (distractors.length >= optionCount - 1) break;
  }

  const options = shuffle([word[field], ...distractors], random);
  const correctIndex = options.indexOf(word[field]);
  return { options, correctIndex };
}

function fieldForType(type: QuestionType): "hanzi" | "pinyin" | "en" {
  switch (type) {
    case "h2e":
      return "en";
    case "e2h":
      return "hanzi";
    case "h2p":
      return "pinyin";
    case "p2h":
      return "hanzi";
    case "listen":
      return "hanzi";
  }
}

function promptForType(type: QuestionType, word: Word): string {
  switch (type) {
    case "h2e":
      return word.hanzi;
    case "e2h":
      return word.en;
    case "h2p":
      return word.hanzi;
    case "p2h":
      return word.pinyin;
    case "listen":
      // The hanzi is spoken aloud, never shown as text (it is the answer).
      return "Listen and choose the correct hanzi";
  }
}

export function isListeningType(type: QuestionType): boolean {
  return type === "listen";
}

/**
 * Builds a single question for `word`, drawing distractors from `pool` (must include `word`
 * and at least 3 other same-lesson words for a full 4-option question).
 */
export function buildQuestion(
  word: Word,
  type: QuestionType,
  pool: Word[],
  random: () => number = Math.random,
  idSuffix: string | number = ""
): QuizQuestion {
  const field = fieldForType(type);
  const optionCount = Math.min(4, pool.length);
  const { options, correctIndex } = buildOptions({ word, pool, field, optionCount, random });
  return {
    id: `${word.lessonId}-${word.hanzi}-${type}-${idSuffix}`,
    type,
    word,
    prompt: promptForType(type, word),
    options,
    correctIndex,
  };
}

/**
 * Generates a quiz covering every word in `words` at least once, with mixed question
 * types, shuffled order. All distractors come from `words` itself (the caller should
 * pass only same-lesson words to keep lessons isolated).
 */
export function generateLessonQuiz(
  words: Word[],
  random: () => number = Math.random
): QuizQuestion[] {
  if (words.length < 4) {
    throw new Error("Need at least 4 words in a lesson to generate a quiz");
  }

  const shuffledTypes = shuffle(ALL_QUESTION_TYPES, random);
  const questions = words.map((word, index) => {
    const type = shuffledTypes[index % shuffledTypes.length];
    return buildQuestion(word, type, words, random, index);
  });

  return shuffle(questions, random);
}
