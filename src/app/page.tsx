import Link from "next/link";
import { LearningApp } from "@/components/learning-app";
import { CourseAITutor } from "@/components/course-ai-tutor";

export default function Home() {
  return (
    <>
      <LearningApp />
      <div
        style={{
          position: "fixed",
          right: 18,
          bottom: 76,
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          alignItems: "flex-end"
        }}
      >
        <Link href="/conversation-coach" className="btn" style={{ boxShadow: "var(--shadow)" }}>
          💬 Conversation Coach
        </Link>
        <Link href="/speaking-coach" className="btn" style={{ boxShadow: "var(--shadow)" }}>
          🎙 Speaking Coach
        </Link>
      </div>
      <CourseAITutor />
    </>
  );
}