import type { Metadata } from "next";
import "./globals.css";
import { ReviewButtonFeedback } from "@/components/review-button-feedback";

export const metadata: Metadata = {
  title: "English C1 Accelerator",
  description: "Speaking-first English learning system from A1+/A2 to CEFR C1"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <ReviewButtonFeedback />
        {children}
      </body>
    </html>
  );
}
