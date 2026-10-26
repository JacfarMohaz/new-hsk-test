import type { Metadata } from "next";
import SettingsView from "@/components/settings/SettingsView";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your local progress for HSK 3 Sprint.",
};

export default function SettingsPage() {
  return <SettingsView />;
}
