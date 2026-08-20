import Link from "next/link";
import { SpeakingCoach } from "@/components/speaking-coach";

export default function SpeakingCoachPage() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">STT</div>
          <div><strong>Speaking Coach</strong><span>transcript-driven practice</span></div>
        </div>
        <nav className="nav">
          <Link className="nav-button active" href="/speaking-coach"><span className="nav-icon">◉</span>Coach</Link>
          <Link className="nav-button" href="/conversation-coach"><span className="nav-icon">💬</span>Conversation</Link>
          <Link className="nav-button" href="/"><span className="nav-icon">←</span>Course</Link>
        </nav>
        <div className="sidebar-footer">
          <div className="tiny">Evidence rule</div>
          <div style={{ fontWeight: 800, margin: "4px 0" }}>Audio + reviewed transcript</div>
          <div className="tiny">Speech-to-text helps audit production. It never certifies C1 or pronunciation by itself.</div>
        </div>
      </aside>
      <main className="main"><SpeakingCoach /></main>
    </div>
  );
}
