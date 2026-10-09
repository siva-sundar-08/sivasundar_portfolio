import Link from "next/link";

export default function NotFound() {
  return (
    <main
      id="main"
      className="flex min-h-svh flex-col items-center justify-center gap-6 px-5 text-center"
    >
      <p className="hud">
        <span className="text-accent">ERR//404</span> · Signal lost
      </p>
      <h1 className="display-wide text-[clamp(3rem,12vw,9rem)] uppercase">Off course</h1>
      <p className="text-ink-dim max-w-md">
        This coordinate is empty. The page may have moved, or it never existed.
      </p>
      <Link href="/" className="glass rounded-full px-6 py-3 font-mono text-xs tracking-[0.24em] uppercase">
        Return to base
      </Link>
    </main>
  );
}
