"use client"

import BPControlQuiz from "@/components/bp-control-quiz"

export const dynamic = "force-dynamic"

export default function Home() {
  const handleQuizComplete = (score: any, answers: any) => {
    console.log("Quiz completed:", { score, answers })
  }

  return <BPControlQuiz onComplete={handleQuizComplete} googleSheetsUrl="YOUR_GOOGLE_SHEETS_WEBHOOK_URL" />
}
