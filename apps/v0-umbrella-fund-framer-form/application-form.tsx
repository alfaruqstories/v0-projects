"use client"

import type React from "react"
import { useState, useEffect } from "react"

// Types
interface Track {
  id: string
  name: string
  status: "open" | "closed" | "waitlist"
}

interface FormData {
  name: string
  organization: string
  email: string
  country: string
  isRegistered: "yes" | "no" | ""
  joinPlatform: "yes" | "no" | ""
  track: string
  conceptNote: File | null
  financialProposal: File | null
}

const ApplicationForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    organization: "",
    email: "",
    country: "",
    isRegistered: "",
    joinPlatform: "",
    track: "",
    conceptNote: null,
    financialProposal: null,
  })

  const [tracks, setTracks] = useState<Track[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  // Countries list (abbreviated for demo - you can expand this)
  const countries = [
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "Germany",
    "France",
    "Japan",
    "Brazil",
    "India",
    "South Africa",
    "Nigeria",
    "Kenya",
  ]

  // Fetch tracks from your backend
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        // For production, replace this with your actual API endpoint
        // const response = await fetch("YOUR_API_ENDPOINT/tracks")
        // const data = await response.json()
        // setTracks(data)

        // Mock data for demo - replace with actual API call
        const mockTracks = [
          { id: "1", name: "Climate Innovation Track", status: "open" as const },
          { id: "2", name: "Sustainable Agriculture Track", status: "open" as const },
          { id: "3", name: "Clean Energy Track", status: "waitlist" as const },
          { id: "4", name: "Water Management Track", status: "closed" as const },
          { id: "5", name: "Ocean Conservation Track", status: "open" as const },
        ]

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500))
        setTracks(mockTracks)
      } catch (error) {
        console.error("Failed to fetch tracks:", error)
        setTracks([
          { id: "1", name: "Climate Innovation Track", status: "open" },
          { id: "2", name: "Sustainable Agriculture Track", status: "open" },
          { id: "3", name: "Clean Energy Track", status: "waitlist" },
          { id: "4", name: "Water Management Track", status: "closed" },
        ])
      }
    }

    fetchTracks()
  }, [])

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (field: "conceptNote" | "financialProposal", file: File | null) => {
    setFormData((prev) => ({ ...prev, [field]: file }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      // Create FormData for file uploads
      const submitData = new FormData()

      // Add form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value instanceof File) {
          submitData.append(key, value)
        } else if (value) {
          submitData.append(key, value.toString())
        }
      })

      // Replace with your Airtable API endpoint or backend
      const response = await fetch("YOUR_AIRTABLE_API_ENDPOINT", {
        method: "POST",
        body: submitData,
        headers: {
          Authorization: "Bearer YOUR_AIRTABLE_API_KEY",
        },
      })

      if (response.ok) {
        setSubmitStatus("success")
        // Reset form
        setFormData({
          name: "",
          organization: "",
          email: "",
          country: "",
          isRegistered: "",
          joinPlatform: "",
          track: "",
          conceptNote: null,
          financialProposal: null,
        })
      } else {
        setSubmitStatus("error")
      }
    } catch (error) {
      console.error("Submission error:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = () => {
    const baseFieldsValid =
      formData.name &&
      formData.organization &&
      formData.email &&
      formData.country &&
      formData.isRegistered &&
      formData.track

    // If user is not registered, they must also answer the joinPlatform question
    if (formData.isRegistered === "no") {
      return baseFieldsValid && formData.joinPlatform
    }

    return baseFieldsValid
  }

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "40px 20px",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        backgroundColor: "#ffffff",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "40px",
          padding: "20px",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
          border: "2px solid #e9ecef",
        }}
      >
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "600",
            color: "#212529",
            margin: "0 0 8px 0",
          }}
        >
          Complete form carefully
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "#6c757d",
            margin: "0",
          }}
        >
          This form is for program application submissions
        </p>
      </div>

      {/* Success/Error Messages */}
      {submitStatus === "success" && (
        <div
          style={{
            padding: "16px",
            backgroundColor: "#d4edda",
            color: "#155724",
            borderRadius: "8px",
            marginBottom: "24px",
            border: "1px solid #c3e6cb",
          }}
        >
          Application submitted successfully!
        </div>
      )}

      {submitStatus === "error" && (
        <div
          style={{
            padding: "16px",
            backgroundColor: "#f8d7da",
            color: "#721c24",
            borderRadius: "8px",
            marginBottom: "24px",
            border: "1px solid #f5c6cb",
          }}
        >
          Failed to submit application. Please try again.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Name Field */}
        <div style={{ marginBottom: "24px" }}>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: "500",
              color: "#212529",
              marginBottom: "8px",
            }}
          >
            Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Enter your name"
            required
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "1px solid #ced4da",
              borderRadius: "6px",
              fontSize: "14px",
              backgroundColor: "#ffffff",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Organization Field */}
        <div style={{ marginBottom: "24px" }}>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: "500",
              color: "#212529",
              marginBottom: "8px",
            }}
          >
            Organization
          </label>
          <input
            type="text"
            value={formData.organization}
            onChange={(e) => handleInputChange("organization", e.target.value)}
            placeholder="Enter your organization"
            required
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "1px solid #ced4da",
              borderRadius: "6px",
              fontSize: "14px",
              backgroundColor: "#ffffff",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Email Field */}
        <div style={{ marginBottom: "24px" }}>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: "500",
              color: "#212529",
              marginBottom: "8px",
            }}
          >
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="Enter your email"
            required
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "1px solid #ced4da",
              borderRadius: "6px",
              fontSize: "14px",
              backgroundColor: "#ffffff",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Country Field */}
        <div style={{ marginBottom: "32px" }}>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: "500",
              color: "#212529",
              marginBottom: "8px",
            }}
          >
            Country
          </label>
          <select
            value={formData.country}
            onChange={(e) => handleInputChange("country", e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "1px solid #ced4da",
              borderRadius: "6px",
              fontSize: "14px",
              backgroundColor: "#ffffff",
              boxSizing: "border-box",
            }}
          >
            <option value="">Select a country</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        {/* Registration Question */}
        <div style={{ marginBottom: "24px" }}>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: "500",
              color: "#212529",
              marginBottom: "8px",
            }}
          >
            Are you registered on the Geo-Rolodex Platform?
          </label>
          <p
            style={{
              fontSize: "13px",
              color: "#6c757d",
              marginBottom: "12px",
              lineHeight: "1.4",
            }}
          >
            A comprehensive geospatial stakeholder mapping platform that drives impactful geospatial investments in
            LMICs.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ display: "flex", alignItems: "center", fontSize: "14px", cursor: "pointer" }}>
              <input
                type="radio"
                name="isRegistered"
                value="yes"
                checked={formData.isRegistered === "yes"}
                onChange={(e) => handleInputChange("isRegistered", e.target.value)}
                style={{ marginRight: "8px" }}
              />
              Yes
            </label>
            <label style={{ display: "flex", alignItems: "center", fontSize: "14px", cursor: "pointer" }}>
              <input
                type="radio"
                name="isRegistered"
                value="no"
                checked={formData.isRegistered === "no"}
                onChange={(e) => handleInputChange("isRegistered", e.target.value)}
                style={{ marginRight: "8px" }}
              />
              No
            </label>
          </div>
        </div>

        {formData.isRegistered === "no" && (
          <div style={{ marginBottom: "32px" }}>
            <p
              style={{
                fontSize: "13px",
                color: "#212529",
                marginBottom: "12px",
                lineHeight: "1.4",
              }}
            >
              To move forward in the application process, you are required to join the Geo-Rolodex Platform. Would you
              like us to send you a request to join?
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ display: "flex", alignItems: "center", fontSize: "14px", cursor: "pointer" }}>
                <input
                  type="radio"
                  name="joinPlatform"
                  value="yes"
                  checked={formData.joinPlatform === "yes"}
                  onChange={(e) => handleInputChange("joinPlatform", e.target.value)}
                  style={{ marginRight: "8px" }}
                />
                Yes
              </label>
              <label style={{ display: "flex", alignItems: "center", fontSize: "14px", cursor: "pointer" }}>
                <input
                  type="radio"
                  name="joinPlatform"
                  value="no"
                  checked={formData.joinPlatform === "no"}
                  onChange={(e) => handleInputChange("joinPlatform", e.target.value)}
                  style={{ marginRight: "8px" }}
                />
                No
              </label>
            </div>
          </div>
        )}

        {/* Track Selection */}
        <div style={{ marginBottom: "32px" }}>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: "500",
              color: "#212529",
              marginBottom: "8px",
            }}
          >
            Track
          </label>
          <select
            value={formData.track}
            onChange={(e) => handleInputChange("track", e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "1px solid #ced4da",
              borderRadius: "6px",
              fontSize: "14px",
              backgroundColor: "#ffffff",
              boxSizing: "border-box",
            }}
          >
            <option value="">Select a track</option>
            {tracks.map((track) => (
              <option key={track.id} value={track.id} disabled={track.status === "closed"}>
                {track.name} {track.status === "waitlist" ? "(Waitlist)" : track.status === "closed" ? "(Closed)" : ""}
              </option>
            ))}
          </select>
        </div>

        {/* File Uploads */}
        <div style={{ marginBottom: "24px" }}>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: "500",
              color: "#212529",
              marginBottom: "8px",
            }}
          >
            Attachment (Concept Note)
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => handleFileChange("conceptNote", e.target.files?.[0] || null)}
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "1px solid #ced4da",
              borderRadius: "6px",
              fontSize: "14px",
              backgroundColor: "#ffffff",
              boxSizing: "border-box",
            }}
          />
          <p
            style={{
              fontSize: "12px",
              color: "#6c757d",
              marginTop: "4px",
            }}
          >
            Note: File should not be more than 1MB (PDF format only).
          </p>
        </div>

        <div style={{ marginBottom: "40px" }}>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: "500",
              color: "#212529",
              marginBottom: "8px",
            }}
          >
            Attachment (Financial Proposal)
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => handleFileChange("financialProposal", e.target.files?.[0] || null)}
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "1px solid #ced4da",
              borderRadius: "6px",
              fontSize: "14px",
              backgroundColor: "#ffffff",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormValid() || isSubmitting}
          style={{
            width: "100%",
            padding: "16px",
            backgroundColor: isFormValid() && !isSubmitting ? "#f4a261" : "#e9ecef",
            color: isFormValid() && !isSubmitting ? "#ffffff" : "#6c757d",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "500",
            cursor: isFormValid() && !isSubmitting ? "pointer" : "not-allowed",
            transition: "all 0.2s ease",
          }}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  )
}

export default ApplicationForm
