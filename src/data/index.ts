import rawData from "./vocabulary.json";
import type { Lesson, RawVocabularyFile, Word } from "@/types/vocabulary";

const typedRaw = rawData as RawVocabularyFile;

const LESSONS: Lesson[] = typedRaw.lessons
  .map((lesson) => ({
    id: lesson.id,
    titleZh: lesson.title_zh,
    titleEn: lesson.title_en,
    words: lesson.words.map(([hanzi, pinyin, pos, en]) => ({
      hanzi,
      pinyin,
      pos,
      en,
      lessonId: lesson.id,
    })),
  }))
  .sort((a, b) => a.id - b.id);

export const TOTAL_LESSONS = LESSONS.length;

export function getAllLessons(): Lesson[] {
  return LESSONS;
}

export function getLesson(id: number): Lesson | undefined {
  return LESSONS.find((lesson) => lesson.id === id);
}

export function getAllWords(): Word[] {
  return LESSONS.flatMap((lesson) => lesson.words);
}

export function getLessonWords(id: number): Word[] {
  return getLesson(id)?.words ?? [];
}
