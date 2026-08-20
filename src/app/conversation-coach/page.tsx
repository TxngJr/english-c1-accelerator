import Link from "next/link";
import { ConversationCoach } from "@/components/conversation-coach";

export default function ConversationCoachPage() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">Q&A</div>
          <div><strong>Conversation Coach</strong><span>unprepared speaking pressure</span></div>
        </div>
        <nav className="nav">
          <Link className="nav-button active" href="/conversation-coach"><span className="nav-icon">◉</span>Conversation</Link>
          <Link className="nav-button" href="/speaking-coach"><span className="nav-icon">🎙</span>Speaking Coach</Link>
          <Link className="nav-button" href="/"><span className="nav-icon">←</span>Course</Link>
        </nav>
        <div className="sidebar-footer">
          <div className="tiny">C1 interaction training</div>
          <div style={{ fontWeight: 800, margin: "4px 0" }}>Unexpected follow-ups</div>
          <div className="tiny">Clarify · defend · qualify · reformulate · synthesize.</div>
        </div>
      </aside>
      <main className="main"><ConversationCoach /></main>
    </div>
  );
}
