import type { Word } from "@/types/vocabulary";
import { getAllWords, getLessonWords } from "@/data";
import { EXAM_SENTENCES, ExamSentence, getOrderableSentences } from "@/data/exam-sentences";
import { shuffle } from "./shuffle";
import { buildQuestion, QuizQuestion } from "./quiz";

export type ExamPart = 1 | 2 | 3 | 4 | 5;

export interface ExamMcQuestion {
  kind: "mc";
  part: ExamPart;
  id: string;
  lessonId: number;
  prompt: string;
  isListening: boolean;
  spokenText?: string;
  options: string[];
  correctIndex: number;
  word: Word;
}

export interface ExamFillBlankQuestion {
  kind: "fill";
  part: 3;
  id: string;
  lessonId: number;
  sentence: string;
  english: string;
  options: string[];
  correctIndex: number;
  answerHanzi: string;
}

export interface ExamOrderQuestion {
  kind: "order";
  part: 4;
  id: string;
  lessonId: number;
  english: string;
  correctTokens: string[];
  shuffledTokens: string[];
}

export interface ExamTypingQuestion {
  kind: "typing";
  part: 5;
  id: string;
  lessonId: number;
  pinyin: string;
  english: string;
  correctHanzi: string;
  word: Word;
}

export type ExamQuestion =
  | ExamMcQuestion
  | ExamFillBlankQuestion
  | ExamOrderQuestion
  | ExamTypingQuestion;

export const EXAM_CONFIG = {
  part1Count: 10,
  part2Count: 15,
  part3Count: 15,
  part4Count: 5,
  part5Count: 5,
  durationMinutes: 45,
};

/**
 * Round-robins through lessons to pick `count` words, balanced across lessons,
 * never repeating a word (by lessonId+hanzi) and never repeating a hanzi value
 * (so the same character isn't tested twice as a "correct answer" in one exam).
 */
function pickBalancedWords(
  pool: Word[],
  count: number,
  random: () => number,
  usedHanzi: Set<string>
): Word[] {
  const byLesson = new Map<number, Word[]>();
  for (const word of pool) {
    if (usedHanzi.has(word.hanzi)) continue;
    const list = byLesson.get(word.lessonId) ?? [];
    list.push(word);
    byLesson.set(word.lessonId, list);
  }

  const lessonIds = shuffle([...byLesson.keys()], random);
  const queues = new Map(lessonIds.map((id) => [id, shuffle(byLesson.get(id)!, random)]));

  const result: Word[] = [];
  let idx = 0;
  const maxIterations = lessonIds.length * pool.length + 10;
  let iterations = 0;

  while (result.length < count && lessonIds.length > 0 && iterations < maxIterations) {
    const lessonId = lessonIds[idx % lessonIds.length];
    const queue = queues.get(lessonId)!;
    while (queue.length > 0) {
      const candidate = queue.shift()!;
      if (!usedHanzi.has(candidate.hanzi)) {
        result.push(candidate);
        usedHanzi.add(candidate.hanzi);
        break;
      }
    }
    idx++;
    iterations++;
  }

  return result;
}

function toExamMc(
  q: QuizQuestion,
  part: ExamPart,
  isListening: boolean
): ExamMcQuestion {
  return {
    kind: "mc",
    part,
    id: `exam-${part}-${q.id}`,
    lessonId: q.word.lessonId,
    prompt: isListening ? "🔊 Listen and choose the correct hanzi" : q.prompt,
    isListening,
    spokenText: isListening ? q.word.hanzi : undefined,
    options: q.options,
    correctIndex: q.correctIndex,
    word: q.word,
  };
}

function buildFillBlankQuestion(
  sentence: ExamSentence,
  random: () => number,
  idSuffix: number
): ExamFillBlankQuestion {
  const lessonWords = getLessonWords(sentence.lessonId);
  const correctWord = lessonWords.find((w) => w.hanzi === sentence.answerHanzi);
  const pool = correctWord ? lessonWords : getAllWords();
  const word: Word = correctWord ?? {
    hanzi: sentence.answerHanzi,
    pinyin: "",
    pos: "",
    en: "",
    lessonId: sentence.lessonId,
  };

  const candidates = pool.filter((w) => w.hanzi !== word.hanzi);
  const distractors = shuffle(candidates, random)
    .map((w) => w.hanzi)
    .filter((h, i, arr) => arr.indexOf(h) === i)
    .slice(0, 3);

  const options = shuffle([sentence.answerHanzi, ...distractors], random);
  const correctIndex = options.indexOf(sentence.answerHanzi);

  return {
    kind: "fill",
    part: 3,
    id: `exam-3-${sentence.lessonId}-${sentence.answerHanzi}-${idSuffix}`,
    lessonId: sentence.lessonId,
    sentence: sentence.sentence,
    english: sentence.english,
    options,
    correctIndex,
    answerHanzi: sentence.answerHanzi,
  };
}

function buildOrderQuestion(
  sentence: ExamSentence & { tokens: string[] },
  random: () => number,
  idSuffix: number
): ExamOrderQuestion {
  let shuffled = shuffle(sentence.tokens, random);
  // Make sure the scrambled order actually differs when there's more than one token.
  if (sentence.tokens.length > 1) {
    let attempts = 0;
    while (shuffled.join("") === sentence.tokens.join("") && attempts < 10) {
      shuffled = shuffle(sentence.tokens, random);
      attempts++;
    }
  }
  return {
    kind: "order",
    part: 4,
    id: `exam-4-${sentence.lessonId}-${sentence.answerHanzi}-${idSuffix}`,
    lessonId: sentence.lessonId,
    english: sentence.english,
    correctTokens: sentence.tokens,
    shuffledTokens: shuffled,
  };
}

function buildTypingQuestion(word: Word, idSuffix: number): ExamTypingQuestion {
  return {
    kind: "typing",
    part: 5,
    id: `exam-5-${word.lessonId}-${word.hanzi}-${idSuffix}`,
    lessonId: word.lessonId,
    pinyin: word.pinyin,
    english: word.en,
    correctHanzi: word.hanzi,
    word,
  };
}

export function generateExam(random: () => number = Math.random): ExamQuestion[] {
  const allWords = getAllWords();
  const usedHanzi = new Set<string>();

  const listeningWords = pickBalancedWords(allWords, EXAM_CONFIG.part1Count, random, usedHanzi);
  const readingWords = pickBalancedWords(allWords, EXAM_CONFIG.part2Count, random, usedHanzi);
  const typingWords = pickBalancedWords(allWords, EXAM_CONFIG.part5Count, random, usedHanzi);

  const part1: ExamMcQuestion[] = listeningWords.map((word, i) => {
    const lessonPool = getLessonWords(word.lessonId);
    const pool = lessonPool.length >= 4 ? lessonPool : allWords;
    const q = buildQuestion(word, "listen", pool, random, `p1-${i}`);
    return toExamMc(q, 1, true);
  });

  const part2: ExamMcQuestion[] = readingWords.map((word, i) => {
    const lessonPool = getLessonWords(word.lessonId);
    const pool = lessonPool.length >= 4 ? lessonPool : allWords;
    const type = i % 2 === 0 ? "h2e" : "e2h";
    const q = buildQuestion(word, type, pool, random, `p2-${i}`);
    return toExamMc(q, 2, false);
  });

  const usedSentenceKeys = new Set<string>();
  const part3Sentences = shuffle(EXAM_SENTENCES, random).slice(0, EXAM_CONFIG.part3Count);
  part3Sentences.forEach((s) => usedSentenceKeys.add(`${s.lessonId}-${s.answerHanzi}`));
  const part3: ExamFillBlankQuestion[] = part3Sentences.map((s, i) =>
    buildFillBlankQuestion(s, random, i)
  );

  const orderable = getOrderableSentences().filter(
    (s) => !usedSentenceKeys.has(`${s.lessonId}-${s.answerHanzi}`)
  );
  const part4Sentences = shuffle(orderable.length >= EXAM_CONFIG.part4Count ? orderable : getOrderableSentences(), random).slice(
    0,
    EXAM_CONFIG.part4Count
  );
  const part4: ExamOrderQuestion[] = part4Sentences.map((s, i) => buildOrderQuestion(s, random, i));

  const part5: ExamTypingQuestion[] = typingWords.map((word, i) => buildTypingQuestion(word, i));

  return [...part1, ...part2, ...part3, ...part4, ...part5];
}

export function isCorrectAnswer(question: ExamQuestion, answer: unknown): boolean {
  switch (question.kind) {
    case "mc":
      return answer === question.correctIndex;
    case "fill":
      return answer === question.correctIndex;
    case "order":
      return Array.isArray(answer) && answer.join("") === question.correctTokens.join("");
    case "typing":
      return typeof answer === "string" && answer.trim() === question.correctHanzi;
  }
}

export const PART_LABELS: Record<ExamPart, string> = {
  1: "Listening",
  2: "Reading match",
  3: "Fill in the blank",
  4: "Sentence ordering",
  5: "Pinyin → Hanzi",
};

export interface ExamScore {
  total: number;
  correct: number;
  percent: number;
  passed: boolean;
  sectionScores: Record<ExamPart, { correct: number; total: number }>;
  lessonMisses: Record<number, number>;
  wrongQuestions: ExamQuestion[];
}

export const PASS_THRESHOLD = 60;

export function scoreExam(
  questions: ExamQuestion[],
  answers: Record<string, unknown>
): ExamScore {
  const sectionScores: Record<ExamPart, { correct: number; total: number }> = {
    1: { correct: 0, total: 0 },
    2: { correct: 0, total: 0 },
    3: { correct: 0, total: 0 },
    4: { correct: 0, total: 0 },
    5: { correct: 0, total: 0 },
  };
  const lessonMisses: Record<number, number> = {};
  const wrongQuestions: ExamQuestion[] = [];
  let correct = 0;

  for (const question of questions) {
    sectionScores[question.part].total++;
    const isRight = isCorrectAnswer(question, answers[question.id]);
    if (isRight) {
      correct++;
      sectionScores[question.part].correct++;
    } else {
      wrongQuestions.push(question);
      lessonMisses[question.lessonId] = (lessonMisses[question.lessonId] ?? 0) + 1;
    }
  }

  const percent = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;

  return {
    total: questions.length,
    correct,
    percent,
    passed: percent >= PASS_THRESHOLD,
    sectionScores,
    lessonMisses,
    wrongQuestions,
  };
}
