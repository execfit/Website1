"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import Header from "@/components/header"

interface TimeSlot {
  time: string
  available: boolean
}

interface Coach {
  id: string
  name: string
  specialty: string
  image: string
  availability: {
    [date: string]: TimeSlot[]
  }
}

export default function BookConsultationPage() {
  const [selectedCoach, setSelectedCoach] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    goals: "",
    experience: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const coaches: Coach[] = [
    {
      id: "gabriela",
      name: "Gabriela Garcia",
      specialty: "Personal Trainer | Nutrition Coach",
      image: "/images/coach-gabriela.jpg",
      availability: {
        "2025-01-27": [
          { time: "9:00 AM", available: true },
          { time: "10:30 AM", available: false },
          { time: "2:00 PM", available: true },
          { time: "4:00 PM", available: true },
        ],
        "2025-01-28": [
          { time: "8:00 AM", available: true },
          { time: "11:00 AM", available: true },
          { time: "1:00 PM", available: false },
          { time: "3:30 PM", available: true },
        ],
        "2025-01-29": [
          { time: "9:30 AM", available: true },
          { time: "12:00 PM", available: true },
          { time: "2:30 PM", available: true },
          { time: "5:00 PM", available: false },
        ],
      },
    },
    {
      id: "maddy",
      name: "Maddy Gold",
      specialty: "Certified Personal Trainer | PN1 Nutrition Coach",
      image: "/images/coach-maddy.jpg",
      availability: {
        "2025-01-27": [
          { time: "8:30 AM", available: true },
          { time: "10:00 AM", available: true },
          { time: "1:30 PM", available: false },
          { time: "3:00 PM", available: true },
        ],
        "2025-01-28": [
          { time: "9:00 AM", available: false },
          { time: "11:30 AM", available: true },
          { time: "2:00 PM", available: true },
          { time: "4:30 PM", available: true },
        ],
        "2025-01-29": [
          { time: "8:00 AM", available: true },
          { time: "10:30 AM", available: true },
          { time: "1:00 PM", available: true },
          { time: "3:30 PM", available: false },
        ],
      },
    },
    {
      id: "yosof",
      name: "Yosof Abuhasan",
      specialty: "Physique/Strength Training/Mindset Coaching",
      image: "/images/coach-yosof.jpg",
      availability: {
        "2025-01-27": [
          { time: "7:00 AM", available: true },
          { time: "9:30 AM", available: true },
          { time: "12:30 PM", available: true },
          { time: "4:30 PM", available: false },
        ],
        "2025-01-28": [
          { time: "7:30 AM", available: false },
          { time: "10:00 AM", available: true },
          { time: "1:30 PM", available: true },
          { time: "3:00 PM", available: true },
        ],
        "2025-01-29": [
          { time: "8:30 AM", available: true },
          { time: "11:00 AM", available: false },
          { time: "2:00 PM", available: true },
          { time: "4:00 PM", available: true },
        ],
      },
    },
  ]

  // Get all available time slots across all coaches for "no preference" option
  const getAllAvailableSlots = () => {
    const allSlots: { [date: string]: TimeSlot[] } = {}

    coaches.forEach((coach) => {
      Object.entries(coach.availability).forEach(([date, slots]) => {
        if (!allSlots[date]) {
          allSlots[date] = []
        }
        slots.forEach((slot) => {
          if (slot.available && !allSlots[date].some((s) => s.time === slot.time)) {
            allSlots[date].push(slot)
          }
        })
      })
    })

    // Sort time slots for each date
    Object.keys(allSlots).forEach((date) => {
      allSlots[date].sort((a, b) => {
        const timeA = new Date(`2000-01-01 ${a.time}`)
        const timeB = new Date(`2000-01-01 ${b.time}`)
        return timeA.getTime() - timeB.getTime()
      })
    })

    return allSlots
  }

  const getAvailableDates = () => {
    if (selectedCoach === "no-preference") {
      return Object.keys(getAllAvailableSlots()).sort()
    }

    const coach = coaches.find((c) => c.id === selectedCoach)
    return coach ? Object.keys(coach.availability).sort() : []
  }

  const getAvailableTimeSlots = () => {
    if (!selectedDate) return []

    if (selectedCoach === "no-preference") {
      return getAllAvailableSlots()[selectedDate] || []
    }

    const coach = coaches.find((c) => c.id === selectedCoach)
    return coach?.availability[selectedDate]?.filter((slot) => slot.available) || []
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setShowSuccess(true)
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
                  <strong>Time:</strong> {selectedTime}
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
                      <label className="block text-sm font-medium mb-3">Available Times</label>
                      <div className="grid grid-cols-2 gap-2">
                        {getAvailableTimeSlots().map((slot) => (
                          <button
                            key={slot.time}
                            type="button"
                            onClick={() => setSelectedTime(slot.time)}
                            className={`p-3 rounded-lg border text-sm transition-all ${
                              selectedTime === slot.time
                                ? "border-white bg-white/10"
                                : "border-white/20 hover:border-white/40"
                            }`}
                          >
                            {slot.time}
                          </button>
                        ))}
                      </div>
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
