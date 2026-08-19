"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error", error);
  }, [error]);

  return (
    <main className="main" role="main">
      <div className="card card-pad" role="alert">
        <div className="kicker">Recovery</div>
        <h1>Something went wrong</h1>
        <p className="muted">
          Your saved progress is stored separately from this screen. Try rendering the page again. If the error repeats,
          export a backup from Settings before clearing browser data.
        </p>
        <button className="btn primary" onClick={reset}>Try again</button>
      </div>
    </main>
  );
}
