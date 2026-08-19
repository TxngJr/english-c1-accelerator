"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <main style={{ maxWidth: 720, margin: "64px auto", padding: 24, fontFamily: "system-ui, sans-serif" }}>
          <h1>English C1 Accelerator could not start</h1>
          <p>
            Refresh the application state by trying again. Local learner data is stored independently and is not reset by this screen.
          </p>
          <button type="button" onClick={reset}>Try again</button>
        </main>
      </body>
    </html>
  );
}
