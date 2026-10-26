import type { Metadata } from "next";
import MistakesView from "@/components/mistakes/MistakesView";

export const metadata: Metadata = {
  title: "Mistakes",
  description: "Review and practice every word you've gotten wrong, across all lessons.",
};

export default function MistakesPage() {
  return <MistakesView />;
}
