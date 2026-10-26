"use client";

export default function SubmitDialog({
  unansweredCount,
  onConfirm,
  onCancel,
}: {
  unansweredCount: number;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="submit-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
    >
      <div className="w-full max-w-sm rounded-2xl border border-white/[0.08] bg-surface p-6 shadow-card">
        <h2 id="submit-dialog-title" className="mb-2 text-lg font-bold text-ink">
          Submit exam?
        </h2>
        <p className="mb-6 text-sm text-ink-muted">
          {unansweredCount > 0
            ? `You have ${unansweredCount} unanswered question(s). Once submitted, you can't go back.`
            : "All questions answered. Once submitted, you can't go back."}
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="focus-ring rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-ink hover:bg-white/10"
          >
            Keep working
          </button>
          <button
            onClick={onConfirm}
            className="focus-ring rounded-lg bg-accent-gradient px-4 py-2 text-sm font-semibold text-white shadow-glow"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
