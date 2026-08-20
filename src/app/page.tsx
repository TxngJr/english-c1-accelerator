import { LearningApp } from "@/components/learning-app";

export default function Home() {
  return (
    <>
      <LearningApp />
      <div
        style={{
          position: "fixed",
          right: 18,
          bottom: 18,
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          alignItems: "flex-end"
        }}
      >
        <a href="/conversation-coach" className="btn" style={{ boxShadow: "var(--shadow)" }}>
          💬 Conversation Coach
        </a>
        <a href="/speaking-coach" className="btn primary" style={{ boxShadow: "var(--shadow)" }}>
          🎙 Speaking Coach
        </a>
      </div>
    </>
  );
}
