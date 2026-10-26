"use client";

import { useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { resetState } from "@/lib/storage";
import { useAppState } from "@/hooks/useAppState";

export default function SettingsView() {
  const { refresh } = useAppState();
  const [confirming, setConfirming] = useState(false);
  const [justReset, setJustReset] = useState(false);

  function handleReset() {
    resetState();
    refresh();
    setConfirming(false);
    setJustReset(true);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-ink">Settings</h1>
        <p className="mt-2 text-sm text-ink-muted">
          All progress is stored only in this browser&apos;s local storage.
        </p>
      </header>

      <div className="rounded-2xl border border-error/30 bg-surface p-6 shadow-card">
        <h2 className="mb-2 flex items-center gap-2 text-lg font-bold text-ink">
          <AlertTriangle className="h-5 w-5 text-error" aria-hidden="true" />
          Reset progress
        </h2>
        <p className="mb-4 text-sm text-ink-muted">
          This permanently deletes every lesson score, exam attempt, and mistake record on this
          device. This cannot be undone.
        </p>

        {justReset ? (
          <p className="text-sm font-medium text-success">Progress has been reset.</p>
        ) : confirming ? (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-ink">Are you sure?</span>
            <button
              onClick={handleReset}
              className="focus-ring inline-flex items-center gap-1.5 rounded-lg bg-error px-4 py-2 text-sm font-semibold text-white"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" /> Yes, reset everything
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="focus-ring rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-ink hover:bg-white/10"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirming(true)}
            className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-error/40 bg-error/10 px-4 py-2 text-sm font-semibold text-error hover:bg-error/20"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" /> Reset progress
          </button>
        )}
      </div>
    </div>
  );
}
