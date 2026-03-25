"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Activity, Target, Pill, Apple, Users, Share2, Phone, Mail } from "lucide-react"

// Question types and interfaces
interface Question {
  id: string
  type: "single" | "multiple" | "input" | "slider" | "blood-pressure"
  title: string
  subtitle?: string
  options?: { value: string; label: string }[]
  required?: boolean
  condition?: (answers: Record<string, any>) => boolean
  min?: number
  max?: number
  step?: number
  placeholder?: string
}

interface QuizAnswer {
  questionId: string
  value: any
  timestamp: Date
}

interface ControlScore {
  total: number
  monitoring: number
  medications: number
  lifestyle: number
  careTeam: number
  awareness: number
  bucket: "low" | "moderate" | "high"
}

// Quiz questions configuration
const questions: Question[] = [
  // A) Condition status
  {
    id: "has_hypertension",
    type: "single",
    title: "Let's start with the basics - do you have high blood pressure?",
    options: [
      { value: "yes", label: "Yes, I've been diagnosed" },
      { value: "no", label: "No, I don't have it" },
      { value: "not_sure", label: "I'm not sure" },
    ],
    required: true,
  },
  {
    id: "family_history",
    type: "multiple",
    title: "Does high blood pressure run in your family?",
    subtitle: "Select all that apply - family history can be important",
    options: [
      { value: "parent", label: "My parent(s)" },
      { value: "sibling", label: "My sibling(s)" },
      { value: "other_relative", label: "Other relatives" },
      { value: "no", label: "No family history" },
      { value: "not_sure", label: "I'm not sure" },
    ],
  },

  // B) Monitoring
  {
    id: "owns_monitor",
    type: "single",
    title: "Do you have your own blood pressure monitor at home?",
    options: [
      { value: "yes", label: "Yes, I have one" },
      { value: "no", label: "No, I don't have one" },
    ],
    required: true,
  },

  // If owns monitor
  {
    id: "check_frequency_home",
    type: "single",
    title: "How often do you check your blood pressure at home?",
    condition: (answers) => answers.owns_monitor === "yes",
    options: [
      { value: "daily", label: "Every day" },
      { value: "2-3_week", label: "2–3 times a week" },
      { value: "weekly", label: "Once a week" },
      { value: "monthly", label: "Once a month" },
      { value: "less_often", label: "Less than once a month" },
    ],
  },
  {
    id: "last_home_check",
    type: "single",
    title: "When did you last check your blood pressure at home?",
    condition: (answers) => answers.owns_monitor === "yes",
    options: [
      { value: "today", label: "Today" },
      { value: "last_7_days", label: "Within the last week" },
      { value: "8-30_days", label: "1-4 weeks ago" },
      { value: "over_30_days", label: "More than a month ago" },
    ],
  },
  {
    id: "last_reading_home",
    type: "blood-pressure",
    title: "What was your most recent reading?",
    subtitle: "You can enter the exact numbers or choose a range if you're not sure",
    condition: (answers) => answers.owns_monitor === "yes",
  },
  {
    id: "tracks_results_home",
    type: "single",
    title: "Do you keep track of your blood pressure readings over time?",
    condition: (answers) => answers.owns_monitor === "yes",
    options: [
      { value: "yes_app", label: "Yes, I use an app or keep records" },
      { value: "sometimes", label: "Sometimes I write them down" },
      { value: "no", label: "No, I don't track them" },
    ],
  },

  // If doesn't own monitor
  {
    id: "where_check",
    type: "single",
    title: "Where do you usually get your blood pressure checked?",
    condition: (answers) => answers.owns_monitor === "no",
    options: [
      { value: "pharmacy", label: "At a pharmacy" },
      { value: "hospital_clinic", label: "Hospital or clinic" },
      { value: "health_outreach", label: "Health fairs or community events" },
      { value: "rarely_never", label: "I rarely or never check it" },
    ],
  },
  {
    id: "last_external_check",
    type: "single",
    title: "When was your last blood pressure check?",
    condition: (answers) => answers.owns_monitor === "no",
    options: [
      { value: "under_3_months", label: "Less than 3 months ago" },
      { value: "3-12_months", label: "3-12 months ago" },
      { value: "over_1_year", label: "More than a year ago" },
      { value: "never", label: "I've never had it checked" },
    ],
  },
  {
    id: "knows_last_reading",
    type: "single",
    title: "Do you remember what your last reading was?",
    condition: (answers) => answers.owns_monitor === "no",
    options: [
      { value: "yes", label: "Yes, I remember" },
      { value: "no", label: "No, I don't remember" },
    ],
  },
  {
    id: "last_reading_external",
    type: "blood-pressure",
    title: "What was your last reading?",
    condition: (answers) => answers.owns_monitor === "no" && answers.knows_last_reading === "yes",
  },
  {
    id: "tracks_results_external",
    type: "single",
    title: "Do you keep track of your blood pressure readings?",
    condition: (answers) => answers.owns_monitor === "no",
    options: [
      { value: "yes_physical", label: "Yes, I write them down or take photos" },
      { value: "sometimes", label: "Sometimes I keep track" },
      { value: "no", label: "No, I don't track them" },
    ],
  },

  // C) Targets & awareness
  {
    id: "knows_target",
    type: "single",
    title: "Do you know what your target blood pressure should be?",
    options: [
      { value: "yes", label: "Yes, I know my target" },
      { value: "no", label: "No, I'm not sure" },
    ],
  },
  {
    id: "clinician_explained",
    type: "single",
    title: "Has a doctor or healthcare provider explained what your blood pressure numbers mean?",
    options: [
      { value: "yes", label: "Yes, they've explained it to me" },
      { value: "no", label: "No, I haven't had it explained" },
    ],
  },

  // D) Medications
  {
    id: "long_term_medicines",
    type: "multiple",
    title: "Are you currently taking any long-term medications?",
    subtitle: "Select all that apply - this helps us understand your overall health picture",
    options: [
      { value: "blood_pressure", label: "Blood pressure medication" },
      { value: "diabetes", label: "Diabetes medication" },
      { value: "thyroid", label: "Thyroid medication" },
      { value: "contraceptives", label: "Birth control or hormones" },
      { value: "steroids", label: "Steroids (like prednisolone)" },
      { value: "pain_nsaids", label: "Pain medication (taken regularly)" },
      { value: "other", label: "Other long-term medication" },
      { value: "none", label: "I don't take any regular medications" },
    ],
  },
  {
    id: "bp_medicines",
    type: "multiple",
    title: "Which blood pressure medications are you taking?",
    subtitle: "Select all that apply - don't worry if you're not sure of the exact names",
    condition: (answers) => answers.long_term_medicines?.includes("blood_pressure"),
    options: [
      { value: "amlodipine", label: "Amlodipine" },
      { value: "lisinopril", label: "Lisinopril" },
      { value: "losartan", label: "Losartan" },
      { value: "hydrochlorothiazide", label: "Hydrochlorothiazide (water pill)" },
      { value: "other", label: "Other medication (or not sure of the name)" },
    ],
  },
  {
    id: "missed_doses",
    type: "single",
    title: "How often do you miss taking your blood pressure medication?",
    subtitle: "Be honest - we're here to help, not judge",
    condition: (answers) => answers.long_term_medicines?.includes("blood_pressure"),
    options: [
      { value: "never", label: "I never miss doses" },
      { value: "1-2_month", label: "1-2 times per month" },
      { value: "weekly", label: "About once a week" },
      { value: "several_week", label: "Several times a week" },
    ],
  },
  {
    id: "refill_timing",
    type: "single",
    title: "Do you refill your blood pressure medication on time?",
    condition: (answers) => answers.long_term_medicines?.includes("blood_pressure"),
    options: [
      { value: "always", label: "Always on time" },
      { value: "sometimes", label: "Sometimes I'm late" },
      { value: "rarely", label: "I often run out" },
    ],
  },

  // E) Lifestyle
  {
    id: "salt_habits",
    type: "multiple",
    title: "Tell us about your salt habits",
    subtitle: "Select all that apply - salt can really affect blood pressure",
    options: [
      { value: "add_at_table", label: "I add salt to my food at the table" },
      { value: "instant_noodles", label: "I eat instant noodles or seasoned foods often" },
      { value: "seasoning_cubes", label: "I use 2 or more seasoning cubes in one meal" },
      { value: "processed_foods", label: "I eat a lot of packaged or processed foods" },
      { value: "none", label: "None of these apply to me" },
    ],
  },
  {
    id: "seasoning_cubes",
    type: "single",
    title: "On a typical cooking day, how many seasoning cubes do you use?",
    options: [
      { value: "0", label: "None" },
      { value: "1", label: "1 cube" },
      { value: "2", label: "2 cubes" },
      { value: "3+", label: "3 or more cubes" },
    ],
  },
  {
    id: "alcohol_frequency",
    type: "single",
    title: "How often do you drink alcohol?",
    options: [
      { value: "never", label: "I don't drink alcohol" },
      { value: "monthly_less", label: "Once a month or less" },
      { value: "2-4_month", label: "2-4 times per month" },
      { value: "2-3_week", label: "2-3 times per week" },
      { value: "4+_week", label: "4 or more times per week" },
    ],
  },
  {
    id: "caffeine_frequency",
    type: "single",
    title: "How often do you have caffeine (tea, coffee, energy drinks)?",
    options: [
      { value: "never", label: "I don't have caffeine" },
      { value: "1-2_week", label: "1-2 times per week" },
      { value: "3-6_week", label: "3-6 times per week" },
      { value: "daily", label: "Once a day" },
      { value: "multiple_daily", label: "Multiple times per day" },
    ],
  },
  {
    id: "fruit_days",
    type: "single",
    title: "How many days per week do you eat fruit?",
    options: [
      { value: "0", label: "I rarely eat fruit" },
      { value: "1-2", label: "1-2 days" },
      { value: "3-4", label: "3-4 days" },
      { value: "5-7", label: "5-7 days" },
    ],
  },
  {
    id: "vegetable_days",
    type: "single",
    title: "How many days per week do you eat vegetables?",
    options: [
      { value: "0", label: "I rarely eat vegetables" },
      { value: "1-2", label: "1-2 days" },
      { value: "3-4", label: "3-4 days" },
      { value: "5-7", label: "5-7 days" },
    ],
  },
  {
    id: "exercise_minutes",
    type: "single",
    title: "How many minutes of moderate exercise do you get per week?",
    subtitle: "Think walking, dancing, gardening - anything that gets you moving",
    options: [
      { value: "0", label: "I don't exercise regularly" },
      { value: "1-60", label: "1-60 minutes" },
      { value: "61-149", label: "61-149 minutes" },
      { value: "150-299", label: "150-299 minutes" },
      { value: "300+", label: "300+ minutes" },
    ],
  },
  {
    id: "stress_level",
    type: "slider",
    title: "On most days, how stressed do you feel?",
    subtitle: "0 means no stress, 10 means extremely stressed",
    min: 0,
    max: 10,
    step: 1,
  },
  {
    id: "sleep_quality",
    type: "slider",
    title: "How would you rate your sleep quality?",
    subtitle: "0 means terrible sleep, 10 means excellent sleep",
    min: 0,
    max: 10,
    step: 1,
  },

  // F) Care team
  {
    id: "regular_care",
    type: "single",
    title: "Do you see a doctor or pharmacist regularly about your blood pressure?",
    options: [
      { value: "yes_regular", label: "Yes, every 1-3 months" },
      { value: "sometimes", label: "Sometimes, every 4-12 months" },
      { value: "no", label: "No, I don't see anyone regularly" },
    ],
  },

  // G) Support wanted
  {
    id: "support_wanted",
    type: "multiple",
    title: "What kind of support would be most helpful for managing your blood pressure?",
    subtitle: "Choose all that interest you - we want to help in the way that works best for you",
    options: [
      { value: "personalized_support", label: "Personalized reminders and support" },
      { value: "understand_readings", label: "Help understanding my blood pressure readings" },
      { value: "pharmacy_connection", label: "Connect me to a pharmacy for testing" },
      { value: "own_monitor", label: "I'd like to get my own blood pressure monitor" },
      { value: "refill_reminders", label: "Medication refill reminders and coaching" },
      { value: "lifestyle_tips", label: "Practical lifestyle tips I can actually follow" },
      { value: "talk_clinician", label: "Talk to a healthcare professional" },
    ],
  },

  // H) Height & weight
  {
    id: "height",
    type: "input",
    title: "What's your height?",
    subtitle: "We'll use this to calculate your BMI, which can affect blood pressure",
    placeholder: "Enter your height in centimeters (e.g., 170)",
  },
  {
    id: "weight",
    type: "input",
    title: "What's your weight?",
    placeholder: "Enter your weight in kilograms (e.g., 70)",
  },

  // I) Demographics
  {
    id: "gender",
    type: "single",
    title: "What's your gender?",
    options: [
      { value: "female", label: "Female" },
      { value: "male", label: "Male" },
      { value: "other", label: "Other / Prefer not to say" },
    ],
  },
  {
    id: "birth_year",
    type: "input",
    title: "What year were you born? (optional)",
    placeholder: "e.g., 1985",
  },

  // J) Contact information for results
  {
    id: "phone_number",
    type: "input",
    title: "What's your phone number?",
    subtitle: "We'll send your personalized results and recommendations via WhatsApp or SMS",
    placeholder: "Enter your phone number",
    required: true,
  },
  {
    id: "email",
    type: "input",
    title: "What's your email address? (optional)",
    subtitle: "We can also email you a detailed report of your results",
    placeholder: "Enter your email address",
  },
]

export default function BPControlQuiz({
  onComplete,
  googleSheetsUrl,
}: {
  onComplete?: (score: ControlScore, answers: Record<string, any>) => void
  googleSheetsUrl?: string
}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [isComplete, setIsComplete] = useState(false)
  const [controlScore, setControlScore] = useState<ControlScore | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get filtered questions based on conditions
  const getVisibleQuestions = () => {
    return questions.filter((q) => !q.condition || q.condition(answers))
  }

  const visibleQuestions = getVisibleQuestions()
  const currentQuestion = visibleQuestions[currentQuestionIndex]

  // Calculate control score
  const calculateControlScore = (answers: Record<string, any>): ControlScore => {
    let monitoring = 0
    let medications = 0
    let lifestyle = 0
    let careTeam = 0
    let awareness = 0

    // Monitoring (30%)
    if (answers.owns_monitor === "yes") {
      monitoring += 10
      if (["daily", "2-3_week"].includes(answers.check_frequency_home)) monitoring += 10
      if (["today", "last_7_days"].includes(answers.last_home_check)) monitoring += 5
      if (answers.tracks_results_home === "yes_app") monitoring += 5
    } else {
      if (["pharmacy", "hospital_clinic"].includes(answers.where_check)) monitoring += 5
      if (answers.last_external_check === "under_3_months") monitoring += 5
      if (answers.tracks_results_external === "yes_physical") monitoring += 5
    }

    // Medications (20%) - only if on BP meds
    if (answers.long_term_medicines?.includes("blood_pressure")) {
      if (answers.missed_doses === "never") medications += 10
      if (answers.refill_timing === "always") medications += 10
    } else {
      medications = 20 // Full points if not on meds (redistribute weight)
    }

    // Lifestyle (30%)
    if (
      !answers.salt_habits?.includes("add_at_table") &&
      !answers.salt_habits?.includes("seasoning_cubes") &&
      answers.seasoning_cubes !== "3+"
    )
      lifestyle += 5
    if (["never", "monthly_less"].includes(answers.alcohol_frequency)) lifestyle += 3
    if (["3-4", "5-7"].includes(answers.fruit_days)) lifestyle += 4
    if (["3-4", "5-7"].includes(answers.vegetable_days)) lifestyle += 4
    if (["150-299", "300+"].includes(answers.exercise_minutes)) lifestyle += 6
    if ((answers.stress_level?.[0] || 10) <= 5) lifestyle += 4
    if ((answers.sleep_quality?.[0] || 0) >= 7) lifestyle += 4

    // Care team (10%)
    if (answers.regular_care === "yes_regular") careTeam += 10
    else if (answers.regular_care === "sometimes") careTeam += 5

    // Awareness (10%)
    if (answers.knows_target === "yes") awareness += 5
    if (answers.clinician_explained === "yes") awareness += 5

    const total = monitoring + medications + lifestyle + careTeam + awareness
    const bucket = total >= 80 ? "high" : total >= 50 ? "moderate" : "low"

    return { total, monitoring, medications, lifestyle, careTeam, awareness, bucket }
  }

  // Handle answer change
  const handleAnswerChange = (value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }))
  }

  // Handle next question
  const handleNext = () => {
    if (currentQuestionIndex < visibleQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      // Quiz complete
      const score = calculateControlScore(answers)
      setControlScore(score)
      setIsComplete(true)
      onComplete?.(score, answers)
    }
  }

  // Handle previous question
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  // Submit to Google Sheets
  const submitToGoogleSheets = async () => {
    if (!googleSheetsUrl) return

    setIsSubmitting(true)
    try {
      const submissionData = {
        timestamp: new Date().toISOString(),
        ...answers,
        control_score: controlScore?.total,
        score_bucket: controlScore?.bucket,
        bmi:
          answers.height && answers.weight
            ? (Number.parseFloat(answers.weight) / Math.pow(Number.parseFloat(answers.height) / 100, 2)).toFixed(1)
            : null,
      }

      await fetch(googleSheetsUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      })
    } catch (error) {
      console.error("Failed to submit to Google Sheets:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Render question input
  const renderQuestionInput = () => {
    const currentAnswer = answers[currentQuestion.id]

    switch (currentQuestion.type) {
      case "single":
        return (
          <div className="space-y-4 w-full max-w-3xl">
            {currentQuestion.options?.map((option) => (
              <div
                key={option.value}
                className={`pill-option ${currentAnswer === option.value ? "selected" : ""}`}
                onClick={() => handleAnswerChange(option.value)}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    currentAnswer === option.value ? "border-white bg-white" : "border-blue-400"
                  }`}
                >
                  {currentAnswer === option.value && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                </div>
                <span className="text-base font-medium">{option.label}</span>
              </div>
            ))}
          </div>
        )

      case "multiple":
        return (
          <div className="space-y-4 w-full max-w-3xl">
            {currentQuestion.options?.map((option) => (
              <div
                key={option.value}
                className={`pill-option ${currentAnswer?.includes(option.value) ? "selected" : ""}`}
                onClick={() => {
                  const newValue = currentAnswer || []
                  if (newValue.includes(option.value)) {
                    handleAnswerChange(newValue.filter((v: string) => v !== option.value))
                  } else {
                    handleAnswerChange([...newValue, option.value])
                  }
                }}
              >
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    currentAnswer?.includes(option.value) ? "border-white bg-white" : "border-blue-400"
                  }`}
                >
                  {currentAnswer?.includes(option.value) && <div className="w-3 h-3 bg-blue-600 rounded-sm" />}
                </div>
                <span className="text-base font-medium">{option.label}</span>
              </div>
            ))}
          </div>
        )

      case "input":
        return (
          <Input
            type={
              currentQuestion.id.includes("year") ||
              currentQuestion.id.includes("height") ||
              currentQuestion.id.includes("weight")
                ? "number"
                : currentQuestion.id.includes("email")
                  ? "email"
                  : currentQuestion.id.includes("phone")
                    ? "tel"
                    : "text"
            }
            placeholder={currentQuestion.placeholder}
            value={currentAnswer || ""}
            onChange={(e) => handleAnswerChange(e.target.value)}
            className="pill-input text-lg text-gray-900 placeholder:text-gray-500 max-w-lg mx-auto"
          />
        )

      case "slider":
        return (
          <div className="space-y-6 max-w-lg mx-auto">
            <Slider
              value={currentAnswer || [currentQuestion.min || 0]}
              onValueChange={handleAnswerChange}
              max={currentQuestion.max || 10}
              min={currentQuestion.min || 0}
              step={currentQuestion.step || 1}
              className="w-full"
            />
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {currentAnswer?.[0] || currentQuestion.min || 0}
              </div>
              <div className="text-gray-600 text-lg">
                {currentQuestion.min || 0} - {currentQuestion.max || 10}
              </div>
            </div>
          </div>
        )

      case "blood-pressure":
        return (
          <div className="space-y-6 w-full max-w-3xl">
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              <div>
                <Input
                  type="number"
                  placeholder="120"
                  value={currentAnswer?.systolic || ""}
                  onChange={(e) =>
                    handleAnswerChange({
                      ...currentAnswer,
                      systolic: e.target.value,
                    })
                  }
                  className="pill-input text-lg text-gray-900 placeholder:text-gray-500 text-center"
                />
                <div className="text-center text-gray-600 text-sm mt-2">Systolic</div>
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="80"
                  value={currentAnswer?.diastolic || ""}
                  onChange={(e) =>
                    handleAnswerChange({
                      ...currentAnswer,
                      diastolic: e.target.value,
                    })
                  }
                  className="pill-input text-lg text-gray-900 placeholder:text-gray-500 text-center"
                />
                <div className="text-center text-gray-600 text-sm mt-2">Diastolic</div>
              </div>
            </div>
            <div className="text-center text-gray-600 text-lg mb-4">Or choose a range:</div>
            <div className="space-y-4 w-full">
              {[
                { value: "normal", label: "Less than 120/80 (Normal)" },
                { value: "elevated", label: "120–139/80–89 (Elevated)" },
                { value: "stage1", label: "140–159/90–99 (Stage 1 High)" },
                { value: "stage2", label: "160+/100+ (Stage 2 High)" },
              ].map((range) => (
                <div
                  key={range.value}
                  className={`pill-option ${currentAnswer?.range === range.value ? "selected" : ""}`}
                  onClick={() => handleAnswerChange({ ...currentAnswer, range: range.value })}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      currentAnswer?.range === range.value ? "border-white bg-white" : "border-blue-400"
                    }`}
                  >
                    {currentAnswer?.range === range.value && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                  </div>
                  <span className="text-base font-medium">{range.label}</span>
                </div>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  // Results component
  const ResultsView = () => {
    if (!controlScore) return null

    const scoreAngle = (controlScore.total / 100) * 360
    const bucketConfig = {
      high: {
        color: "text-emerald-600",
        bg: "bg-emerald-500",
        label: "High Control",
        message: "Excellent! You're managing your BP well.",
      },
      moderate: {
        color: "text-yellow-600",
        bg: "bg-yellow-500",
        label: "Moderate Control",
        message: "Good progress! A few improvements can help.",
      },
      low: {
        color: "text-red-600",
        bg: "bg-red-500",
        label: "Needs Attention",
        message: "Let's work together to improve your BP control.",
      },
    }

    const config = bucketConfig[controlScore.bucket]

    const wantsPharmacyConnection = answers.support_wanted?.includes("pharmacy_connection")

    return (
      <div className="space-y-8 text-gray-900">
        {/* Score Display */}
        <div className="text-center">
          <div className="relative w-48 h-48 mx-auto mb-6">
            <div
              className="w-full h-full rounded-full score-dial flex items-center justify-center"
              style={{ "--score-angle": `${scoreAngle}deg` } as React.CSSProperties}
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-full w-32 h-32 flex items-center justify-center shadow-lg">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{controlScore.total}%</div>
                  <div className="text-sm text-gray-600">Control Score</div>
                </div>
              </div>
            </div>
          </div>
          <h2 className={`text-2xl font-bold ${config.color} mb-2`}>{config.label}</h2>
          <p className="text-gray-700 text-lg">{config.message}</p>
        </div>

        {/* Score Breakdown */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Your Score Breakdown
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2 text-gray-700">
                <Activity className="w-4 h-4" />
                Monitoring
              </span>
              <span className="font-semibold text-gray-900">{controlScore.monitoring}/30</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2 text-gray-700">
                <Pill className="w-4 h-4" />
                Medications
              </span>
              <span className="font-semibold text-gray-900">{controlScore.medications}/20</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2 text-gray-700">
                <Apple className="w-4 h-4" />
                Lifestyle
              </span>
              <span className="font-semibold text-gray-900">{controlScore.lifestyle}/30</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2 text-gray-700">
                <Users className="w-4 h-4" />
                Care Team
              </span>
              <span className="font-semibold text-gray-900">{controlScore.careTeam}/10</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          {wantsPharmacyConnection && (
            <Button
              onClick={submitToGoogleSheets}
              disabled={isSubmitting}
              className="pill-button flex-1 bg-blue-600 hover:bg-blue-700 text-white border-0"
            >
              <Phone className="w-4 h-4 mr-2" />
              {isSubmitting ? "Connecting..." : "Find Nearby Pharmacies"}
            </Button>
          )}
          <Button
            onClick={submitToGoogleSheets}
            disabled={isSubmitting}
            className="pill-button flex-1 bg-green-600 hover:bg-green-700 text-white border-0"
          >
            <Mail className="w-4 h-4 mr-2" />
            {isSubmitting ? "Sending..." : "Send My Results"}
          </Button>
          <Button
            variant="outline"
            className="pill-button flex-1 bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Results
          </Button>
        </div>
      </div>
    )
  }

  if (isComplete) {
    return (
      <div className="quiz-container">
        <div className="glass-card w-full max-w-4xl p-8">
          <ResultsView />
        </div>
      </div>
    )
  }

  return (
    <div className="quiz-container">
      <div className="glass-card w-full max-w-4xl">
        <div className="px-8 py-8 space-y-8">
          <div className="question-content">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 text-balance">{currentQuestion.title}</h1>
            {currentQuestion.subtitle && <p className="text-gray-600 text-lg">{currentQuestion.subtitle}</p>}
          </div>

          <div className="min-h-[300px] flex items-center justify-start">
            <div className="options-container w-full">{renderQuestionInput()}</div>
          </div>

          <div className="flex justify-between items-center pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="pill-button bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={currentQuestion.required && !answers[currentQuestion.id]}
              className="pill-button bg-blue-600 hover:bg-blue-700 text-white border-0"
            >
              {currentQuestionIndex === visibleQuestions.length - 1 ? "Get My Results" : "Continue"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
