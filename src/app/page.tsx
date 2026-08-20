import { LearningApp } from "@/components/learning-app";

export default function Home() {
  return (
    <>
      <LearningApp />
      <a
        href="/speaking-coach"
        className="btn primary"
        style={{
          position: "fixed",
          right: 18,
          bottom: 18,
          zIndex: 50,
          boxShadow: "var(--shadow)"
        }}
      >
        🎙 Speaking Coach
      </a>
    </>
  );
}
