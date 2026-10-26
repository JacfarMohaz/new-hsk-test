import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
      <h1 className="text-3xl font-black text-ink">Page not found</h1>
      <p className="text-ink-muted">That lesson or page doesn&apos;t exist.</p>
      <Link
        href="/"
        className="focus-ring rounded-lg bg-accent-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-glow"
      >
        Back to home
      </Link>
    </div>
  );
}
