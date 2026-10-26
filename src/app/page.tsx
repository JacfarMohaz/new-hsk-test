import type { Metadata } from "next";
import HomeView from "@/components/home/HomeView";

export const metadata: Metadata = {
  title: "HSK 3 Sprint — Vocabulary Exam Prep",
  description: "20 lessons, mixed-type quizzes, and a full HSK 3 mock exam.",
};

export default function Home() {
  return <HomeView />;
}
