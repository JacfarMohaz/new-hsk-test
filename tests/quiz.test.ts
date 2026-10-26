import { describe, expect, it } from "vitest";
import { getAllLessons, getLesson, getLessonWords, TOTAL_LESSONS } from "@/data";
import { generateLessonQuiz } from "@/lib/quiz";
import { mulberry32 } from "@/lib/shuffle";

describe("vocabulary data", () => {
  it("loads 20 lessons", () => {
    expect(TOTAL_LESSONS).toBe(20);
    expect(getAllLessons()).toHaveLength(20);
  });

  it("every lesson has at least 4 words (quiz needs 4 options)", () => {
    for (const lesson of getAllLessons()) {
      expect(lesson.words.length).toBeGreaterThanOrEqual(4);
    }
  });
});

describe("generateLessonQuiz", () => {
  for (const lessonId of [1, 7, 15, 20]) {
    describe(`lesson ${lessonId}`, () => {
      const words = getLessonWords(lessonId);
      const random = mulberry32(42 + lessonId);
      const quiz = generateLessonQuiz(words, random);

      it("never includes words from other lessons", () => {
        for (const question of quiz) {
          expect(question.word.lessonId).toBe(lessonId);
        }
      });

      it("covers every word in the lesson at least once", () => {
        const testedHanzi = new Set(quiz.map((q) => q.word.hanzi));
        for (const word of words) {
          expect(testedHanzi.has(word.hanzi)).toBe(true);
        }
      });

      it("every question has exactly one correct option and no duplicate options", () => {
        for (const question of quiz) {
          expect(question.options).toHaveLength(Math.min(4, words.length));
          const uniqueOptions = new Set(question.options);
          expect(uniqueOptions.size).toBe(question.options.length);
          expect(question.correctIndex).toBeGreaterThanOrEqual(0);
          expect(question.correctIndex).toBeLessThan(question.options.length);
        }
      });

      it("options never contain a distractor with the same hanzi or english as the correct word", () => {
        for (const question of quiz) {
          const correctValue = question.options[question.correctIndex];
          const otherOptions = question.options.filter((_, i) => i !== question.correctIndex);
          for (const opt of otherOptions) {
            expect(opt).not.toBe(correctValue);
          }
        }
      });
    });
  }

  it("quiz order is shuffled differently across random seeds", () => {
    const words = getLessonWords(1);
    const quizA = generateLessonQuiz(words, mulberry32(1));
    const quizB = generateLessonQuiz(words, mulberry32(2));
    const orderA = quizA.map((q) => q.word.hanzi).join(",");
    const orderB = quizB.map((q) => q.word.hanzi).join(",");
    expect(orderA).not.toBe(orderB);
  });

  it("throws if fewer than 4 words are provided", () => {
    const words = getLessonWords(1).slice(0, 2);
    expect(() => generateLessonQuiz(words)).toThrow();
  });
});

describe("lesson isolation across all 20 lessons", () => {
  for (let id = 1; id <= 20; id++) {
    it(`lesson ${id} quiz stays within lesson ${id}`, () => {
      const lesson = getLesson(id);
      expect(lesson).toBeDefined();
      const quiz = generateLessonQuiz(lesson!.words, mulberry32(id));
      for (const q of quiz) {
        expect(q.word.lessonId).toBe(id);
      }
    });
  }
});
