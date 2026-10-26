import type { Metadata } from "next";
import ExamView from "@/components/exam/ExamView";

export const metadata: Metadata = {
  title: "Final Mock Exam",
  description: "A full-length HSK 3 mock exam drawing from all 20 lessons, with a 45 minute timer.",
};

export default function ExamPage() {
  return <ExamView />;
}
