import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getAllLessons, getLesson, TOTAL_LESSONS } from "@/data";
import LessonView from "@/components/lesson/LessonView";

export function generateStaticParams() {
  return getAllLessons().map((lesson) => ({ id: String(lesson.id) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const lesson = getLesson(Number(id));
  if (!lesson) return { title: "Lesson not found" };
  return {
    title: `Lesson ${lesson.id}: ${lesson.titleEn}`,
    description: `Study and quiz on ${lesson.words.length} HSK 3 words from "${lesson.titleZh}".`,
  };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lesson = getLesson(Number(id));
  if (!lesson) notFound();

  return (
    <Suspense fallback={null}>
      <LessonView lesson={lesson} totalLessons={TOTAL_LESSONS} />
    </Suspense>
  );
}
