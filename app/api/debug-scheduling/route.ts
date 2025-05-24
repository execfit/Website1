import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

interface Coach {
  id: string
  name: string
  email: string
  specialty: string
  image: string
}

interface TimeSlot {
  id: string
  coach_id: string
  date: string
  start_time: string
  end_time: string
  is_available: boolean
}

interface Consultation {
  id: string
  coach_id: string
  client_name: string
  client_email: string
  consultation_date: string
  consultation_time: string
}

export async function GET() {
  try {
    // Get all coaches
    const { data: coaches, error: coachesError } = await supabase.from("coaches").select("*")

    if (coachesError) {
      return NextResponse.json({ error: "Failed to fetch coaches", details: coachesError.message }, { status: 500 })
    }

    // Get all time slots
    const { data: timeSlots, error: timeSlotsError } = await supabase.from("time_slots").select("*")

    if (timeSlotsError) {
      return NextResponse.json(
        { error: "Failed to fetch time slots", details: timeSlotsError.message },
        { status: 500 },
      )
    }

    // Group time slots by coach
    const slotsByCoach: Record<string, TimeSlot[]> = {}
    timeSlots?.forEach((slot: TimeSlot) => {
      if (!slotsByCoach[slot.coach_id]) {
        slotsByCoach[slot.coach_id] = []
      }
      slotsByCoach[slot.coach_id].push(slot)
    })

    // Get consultations
    const { data: consultations, error: consultationsError } = await supabase.from("consultations").select("*")

    return NextResponse.json({
      coaches: coaches || [],
      timeSlots: timeSlots || [],
      slotsByCoach,
      consultations: consultations || [],
      summary: {
        totalCoaches: coaches?.length || 0,
        totalTimeSlots: timeSlots?.length || 0,
        totalConsultations: consultations?.length || 0,
        coachesWithSlots: Object.keys(slotsByCoach).length,
      },
    })
  } catch (error) {
    console.error("Debug error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    return NextResponse.json({ error: "Internal server error", details: errorMessage }, { status: 500 })
  }
}
