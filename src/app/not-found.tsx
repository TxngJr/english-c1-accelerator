export default function NotFound() {
  return (
    <main className="main" role="main">
      <div className="card card-pad">
        <div className="kicker">404</div>
        <h1>Page not found</h1>
        <p className="muted">This route does not exist. Your learner progress has not been changed.</p>
        <a className="btn primary" href="/">Return to English C1 Accelerator</a>
      </div>
    </main>
  );
}
