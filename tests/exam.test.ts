import { describe, expect, it } from "vitest";
import { generateExam, EXAM_CONFIG } from "@/lib/exam";
import { mulberry32 } from "@/lib/shuffle";

describe("generateExam", () => {
  const exam = generateExam(mulberry32(7));
  const total =
    EXAM_CONFIG.part1Count +
    EXAM_CONFIG.part2Count +
    EXAM_CONFIG.part3Count +
    EXAM_CONFIG.part4Count +
    EXAM_CONFIG.part5Count;

  it("generates the configured total number of questions", () => {
    expect(exam).toHaveLength(total);
  });

  it("draws from multiple lessons (not just one)", () => {
    const lessonIds = new Set(exam.map((q) => q.lessonId));
    expect(lessonIds.size).toBeGreaterThan(5);
  });

  it("multiple-choice and fill-in-blank questions have exactly one correct, unique option", () => {
    for (const q of exam) {
      if (q.kind === "mc" || q.kind === "fill") {
        const uniqueOptions = new Set(q.options);
        expect(uniqueOptions.size).toBe(q.options.length);
        expect(q.correctIndex).toBeGreaterThanOrEqual(0);
        expect(q.correctIndex).toBeLessThan(q.options.length);
      }
    }
  });

  it("order questions' shuffled tokens are a permutation of the correct tokens", () => {
    for (const q of exam) {
      if (q.kind === "order") {
        expect([...q.shuffledTokens].sort()).toEqual([...q.correctTokens].sort());
      }
    }
  });

  it("typing questions carry a non-empty correct hanzi answer", () => {
    for (const q of exam) {
      if (q.kind === "typing") {
        expect(q.correctHanzi.length).toBeGreaterThan(0);
      }
    }
  });
});
