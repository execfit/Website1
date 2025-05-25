"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import Header from "@/components/header"

interface Coach {
  id: string
  name: string
  specialty: string
  image: string
}

interface TimeSlot {
  id: string
  start_time: string
  end_time: string
  coach_name?: string
  coach_specialty?: string
}

export default function BookConsultationPage() {
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [selectedCoach, setSelectedCoach] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    goals: "",
    experience: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)

  // Load coaches on component mount
  useEffect(() => {
    const defaultCoaches = [
      {
        id: "gabriela",
        name: "Gabriela Garcia",
        specialty: "Personal Trainer | Nutrition Coach",
        image: "/images/coach-gabriela.jpg",
      },
      {
        id: "maddy",
        name: "Maddy Gold",
        specialty: "Certified Personal Trainer | PN1 Nutrition Coach",
        image: "/images/coach-maddy.jpg",
      },
      {
        id: "yosof",
        name: "Yosof Abuhasan",
        specialty: "Physique/Strength Training/Mindset Coaching",
        image: "/images/coach-yosof.jpg",
      },
    ]
    setCoaches(defaultCoaches)
  }, [])

  // Load available slots when coach or date changes
  useEffect(() => {
    if (selectedCoach && selectedDate) {
      loadAvailableSlots()
    } else {
      setAvailableSlots([])
      setSelectedTime("")
    }
  }, [selectedCoach, selectedDate])

  const loadAvailableSlots = async () => {
    setIsLoadingSlots(true)
    setError(null)

    try {
      const response = await fetch(`/api/consultations/availability?coach_id=${selectedCoach}&date=${selectedDate}`)

      if (response.ok) {
        const slots = await response.json()
        console.log("Loaded slots:", slots)
        setAvailableSlots(slots)
      } else {
        // Fallback to mock data for demo
        const mockSlots = [
          { id: "1", start_time: "09:00:00", end_time: "10:00:00" },
          { id: "2", start_time: "10:00:00", end_time: "11:00:00" },
          { id: "3", start_time: "14:00:00", end_time: "15:00:00" },
          { id: "4", start_time: "15:00:00", end_time: "16:00:00" },
          { id: "5", start_time: "16:00:00", end_time: "17:00:00" },
        ]
        setAvailableSlots(mockSlots)
      }
    } catch (error) {
      console.error("Error loading slots:", error)
      setError("Failed to load available time slots")
      // Fallback to mock data
      const mockSlots = [
        { id: "1", start_time: "09:00:00", end_time: "10:00:00" },
        { id: "2", start_time: "10:00:00", end_time: "11:00:00" },
        { id: "3", start_time: "14:00:00", end_time: "15:00:00" },
        { id: "4", start_time: "15:00:00", end_time: "16:00:00" },
        { id: "5", start_time: "16:00:00", end_time: "17:00:00" },
      ]
      setAvailableSlots(mockSlots)
    } finally {
      setIsLoadingSlots(false)
    }
  }

  const getAvailableDates = () => {
    const dates = []
    const today = new Date()

    for (let i = 1; i <= 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)

      // Skip weekends
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date.toISOString().split("T")[0])
      }
    }

    return dates
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    console.log("🚀 Starting consultation booking submission")

    try {
      const bookingData = {
        coach_id: selectedCoach === "no-preference" ? null : selectedCoach,
        client_name: formData.name,
        client_email: formData.email,
        client_phone: formData.phone,
        consultation_date: selectedDate,
        consultation_time: selectedTime,
        client_goals: formData.goals,
        client_experience: formData.experience,
      }

      console.log("📋 Booking data:", bookingData)

      const response = await fetch("/api/consultations/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      })

      console.log("📡 Response status:", response.status)

      if (response.ok) {
        const result = await response.json()
        console.log("✅ Booking successful:", result)
        setShowSuccess(true)
      } else {
        const errorData = await response.json()
        console.error("❌ Booking failed:", errorData)
        setError(errorData.error || `Failed to book consultation (${response.status})`)
      }
    } catch (error) {
      console.error("💥 Error booking consultation:", error)
      setError("Failed to book consultation. Please check your internet connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":")
    const date = new Date()
    date.setHours(Number.parseInt(hours), Number.parseInt(minutes))
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  // Remove duplicates and group by time for "no preference"
  const getUniqueTimeSlots = () => {
    if (selectedCoach === "no-preference") {
      const timeMap = new Map()
      availableSlots.forEach((slot) => {
        const timeKey = slot.start_time
        if (!timeMap.has(timeKey)) {
          timeMap.set(timeKey, slot)
        }
      })
      return Array.from(timeMap.values()).sort((a, b) => a.start_time.localeCompare(b.start_time))
    }
    return availableSlots
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <div className="pt-24 pb-16">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <div className="bg-gradient-to-br from-black/80 to-black/60 backdrop-blur-md border border-white/20 rounded-xl p-8">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold mb-4">Consultation Booked!</h1>
              <p className="text-white/80 mb-6">
                Thank you for booking your free consultation. We'll send you a confirmation email shortly with all the
                details.
              </p>
              <div className="space-y-2 text-sm text-white/60 mb-8">
                <p>
                  <strong>Date:</strong> {selectedDate ? formatDate(selectedDate) : "TBD"}
                </p>
                <p>
                  <strong>Time:</strong> {formatTime(selectedTime)}
                </p>
                <p>
                  <strong>Coach:</strong>{" "}
                  {selectedCoach === "no-preference"
                    ? "Best Available"
                    : coaches.find((c) => c.id === selectedCoach)?.name}
                </p>
              </div>
              <Link
                href="/"
                className="inline-block bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-white/90 transition-colors"
              >
                Return to Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              Book Your Free Consultation
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Take the first step towards transforming your fitness. Our expert coaches will create a personalized plan
              just for you.
            </p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6 text-center">
              <p className="text-red-200">{error}</p>
              <button onClick={() => setError(null)} className="mt-2 text-sm text-red-300 hover:text-red-100 underline">
                Dismiss
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Coach Selection */}
            <div className="bg-gradient-to-br from-black/80 to-black/60 backdrop-blur-md border border-white/20 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-6">Choose Your Coach</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* No Preference Option */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCoach("no-preference")
                    setSelectedDate("")
                    setSelectedTime("")
                  }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedCoach === "no-preference"
                      ? "border-white bg-white/10"
                      : "border-white/20 hover:border-white/40"
                  }`}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-bold text-sm mb-1">No Preference</h3>
                  <p className="text-xs text-white/60">Best available coach</p>
                </button>

                {/* Individual Coaches */}
                {coaches.map((coach) => (
                  <button
                    key={coach.id}
                    type="button"
                    onClick={() => {
                      setSelectedCoach(coach.id)
                      setSelectedDate("")
                      setSelectedTime("")
                    }}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedCoach === coach.id ? "border-white bg-white/10" : "border-white/20 hover:border-white/40"
                    }`}
                  >
                    <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-3 border-2 border-white/30">
                      <Image
                        src={coach.image || "/placeholder.svg"}
                        alt={coach.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-bold text-sm mb-1">{coach.name}</h3>
                    <p className="text-xs text-white/60">{coach.specialty}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Date & Time Selection */}
            {selectedCoach && (
              <div className="bg-gradient-to-br from-black/80 to-black/60 backdrop-blur-md border border-white/20 rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-6">Select Date & Time</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Date Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-3">Available Dates</label>
                    <div className="space-y-2">
                      {getAvailableDates().map((date) => (
                        <button
                          key={date}
                          type="button"
                          onClick={() => {
                            setSelectedDate(date)
                            setSelectedTime("")
                          }}
                          className={`w-full p-3 rounded-lg border text-left transition-all ${
                            selectedDate === date ? "border-white bg-white/10" : "border-white/20 hover:border-white/40"
                          }`}
                        >
                          {formatDate(date)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Selection */}
                  {selectedDate && (
                    <div>
                      <label className="block text-sm font-medium mb-3">
                        Available Times
                        {isLoadingSlots && <span className="text-white/60 ml-2">(Loading...)</span>}
                      </label>

                      {isLoadingSlots ? (
                        <div className="flex items-center justify-center p-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        </div>
                      ) : getUniqueTimeSlots().length > 0 ? (
                        <div className="grid grid-cols-2 gap-2">
                          {getUniqueTimeSlots().map((slot) => (
                            <button
                              key={`${slot.start_time}-${slot.id}`}
                              type="button"
                              onClick={() => setSelectedTime(slot.start_time)}
                              className={`p-3 rounded-lg border text-sm transition-all ${
                                selectedTime === slot.start_time
                                  ? "border-white bg-white/10"
                                  : "border-white/20 hover:border-white/40"
                              }`}
                            >
                              {formatTime(slot.start_time)}
                              {selectedCoach === "no-preference" && slot.coach_name && (
                                <div className="text-xs text-white/60 mt-1">{slot.coach_name}</div>
                              )}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center p-8 text-white/60">
                          No available time slots for this date. Please select another date.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Contact Information */}
            {selectedTime && (
              <div className="bg-gradient-to-br from-black/80 to-black/60 backdrop-blur-md border border-white/20 rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-6">Your Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/50 focus:outline-none"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/50 focus:outline-none"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/50 focus:outline-none"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Fitness Experience</label>
                    <select
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className="w-full p-3 bg-black/50 border border-white/20 rounded-lg text-white focus:border-white/50 focus:outline-none"
                    >
                      <option value="">Select experience level</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Fitness Goals</label>
                    <textarea
                      value={formData.goals}
                      onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                      rows={4}
                      className="w-full p-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-white/50 focus:outline-none resize-none"
                      placeholder="Tell us about your fitness goals and what you'd like to achieve..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            {selectedTime && (
              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.name || !formData.email || !formData.phone}
                  className="bg-white text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Booking..." : "Book Free Consultation"}
                </button>
                <p className="text-sm text-white/60 mt-4">
                  By booking, you agree to our terms and conditions. We'll send you a confirmation email with meeting
                  details.
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
