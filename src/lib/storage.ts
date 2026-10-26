import type { Word } from "@/types/vocabulary";

export interface LessonProgress {
  bestScore: number; // 0-100
  attempts: number;
  lastAttemptAt: string | null;
  mistakes: Word[];
}

export interface ExamAttempt {
  date: string;
  score: number; // 0-100
  sectionScores: Record<string, number>;
  lessonMisses: Record<number, number>;
}

export interface AppState {
  lastOpenedLesson: number | null;
  lessonProgress: Record<number, LessonProgress>;
  examHistory: ExamAttempt[];
  mistakeBank: Word[];
  settings: {
    hidePinyinDefault: boolean;
    hideEnglishDefault: boolean;
  };
}

const STORAGE_KEY = "hsk3-sprint-state-v1";

const DEFAULT_STATE: AppState = {
  lastOpenedLesson: null,
  lessonProgress: {},
  examHistory: [],
  mistakeBank: [],
  settings: {
    hidePinyinDefault: false,
    hideEnglishDefault: false,
  },
};

function isClient(): boolean {
  return typeof window !== "undefined";
}

export function loadState(): AppState {
  if (!isClient()) return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredCloneState(DEFAULT_STATE);
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return {
      ...structuredCloneState(DEFAULT_STATE),
      ...parsed,
      settings: { ...DEFAULT_STATE.settings, ...parsed.settings },
    };
  } catch {
    return structuredCloneState(DEFAULT_STATE);
  }
}

function structuredCloneState(state: AppState): AppState {
  return JSON.parse(JSON.stringify(state));
}

export function saveState(state: AppState): void {
  if (!isClient()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage errors (quota, private mode, etc.)
  }
}

export function resetState(): AppState {
  if (isClient()) {
    window.localStorage.removeItem(STORAGE_KEY);
  }
  return structuredCloneState(DEFAULT_STATE);
}

export function setLastOpenedLesson(lessonId: number): void {
  const state = loadState();
  state.lastOpenedLesson = lessonId;
  saveState(state);
}

export function recordLessonQuizResult(
  lessonId: number,
  scorePercent: number,
  mistakes: Word[]
): AppState {
  const state = loadState();
  const existing = state.lessonProgress[lessonId];
  const bestScore = existing ? Math.max(existing.bestScore, scorePercent) : scorePercent;

  state.lessonProgress[lessonId] = {
    bestScore,
    attempts: (existing?.attempts ?? 0) + 1,
    lastAttemptAt: new Date().toISOString(),
    mistakes,
  };

  // Merge into the global mistake bank (dedupe by hanzi + lessonId).
  const bankKeys = new Set(state.mistakeBank.map((w) => `${w.lessonId}-${w.hanzi}`));
  for (const word of mistakes) {
    const key = `${word.lessonId}-${word.hanzi}`;
    if (!bankKeys.has(key)) {
      state.mistakeBank.push(word);
      bankKeys.add(key);
    }
  }
  // Remove words the user just answered correctly from the bank for this lesson.
  const missedKeys = new Set(mistakes.map((w) => `${w.lessonId}-${w.hanzi}`));
  state.mistakeBank = state.mistakeBank.filter(
    (w) => w.lessonId !== lessonId || missedKeys.has(`${w.lessonId}-${w.hanzi}`)
  );

  saveState(state);
  return state;
}

export function recordExamAttempt(attempt: ExamAttempt): AppState {
  const state = loadState();
  state.examHistory.push(attempt);
  saveState(state);
  return state;
}

export function addMistakes(words: Word[]): void {
  const state = loadState();
  const bankKeys = new Set(state.mistakeBank.map((w) => `${w.lessonId}-${w.hanzi}`));
  for (const word of words) {
    const key = `${word.lessonId}-${word.hanzi}`;
    if (!bankKeys.has(key)) {
      state.mistakeBank.push(word);
      bankKeys.add(key);
    }
  }
  saveState(state);
}

export function clearMistake(word: Word): void {
  const state = loadState();
  state.mistakeBank = state.mistakeBank.filter(
    (w) => !(w.lessonId === word.lessonId && w.hanzi === word.hanzi)
  );
  saveState(state);
}
