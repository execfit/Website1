import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

interface TimeSlot {
  id: string
  coach_id: string
  date: string
  start_time: string
  end_time: string
  is_available: boolean
}

interface Coach {
  id: string
  name: string
  email: string
  specialty: string
}

interface AvailableSlot {
  id: string
  time: string
  coach_id: string
  coach_name: string
  coach_specialty: string
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const coachId = searchParams.get("coachId")
    const date = searchParams.get("date")

    if (!date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 })
    }

    if (coachId === "no-preference") {
      // Get all coaches
      const { data: coaches, error: coachesError } = await supabase.from("coaches").select("*")

      if (coachesError) {
        return NextResponse.json({ error: "Failed to fetch coaches", details: coachesError.message }, { status: 500 })
      }

      // Get time slots for all coaches
      const allSlots: AvailableSlot[] = []

      if (coaches && coaches.length > 0) {
        for (const coach of coaches as Coach[]) {
          const { data: slots, error: slotsError } = await supabase
            .from("time_slots")
            .select("*")
            .eq("coach_id", coach.id)
            .eq("date", date)
            .eq("is_available", true)
            .order("start_time")

          if (!slotsError && slots) {
            slots.forEach((slot: TimeSlot) => {
              allSlots.push({
                id: slot.id,
                time: slot.start_time,
                coach_id: coach.id,
                coach_name: coach.name,
                coach_specialty: coach.specialty,
              })
            })
          }
        }
      }

      // Remove duplicates by time
      const uniqueSlots: AvailableSlot[] = []
      const seenTimes = new Set<string>()

      allSlots
        .sort((a, b) => a.time.localeCompare(b.time))
        .forEach((slot) => {
          if (!seenTimes.has(slot.time)) {
            seenTimes.add(slot.time)
            uniqueSlots.push(slot)
          }
        })

      return NextResponse.json(uniqueSlots)
    } else {
      // Get time slots for specific coach
      const { data: slots, error: slotsError } = await supabase
        .from("time_slots")
        .select("*")
        .eq("coach_id", coachId)
        .eq("date", date)
        .eq("is_available", true)
        .order("start_time")

      if (slotsError) {
        return NextResponse.json({ error: "Failed to fetch time slots", details: slotsError.message }, { status: 500 })
      }

      // Get coach info
      const { data: coach, error: coachError } = await supabase.from("coaches").select("*").eq("id", coachId).single()

      if (coachError) {
        return NextResponse.json({ error: "Failed to fetch coach", details: coachError.message }, { status: 500 })
      }

      const availableSlots: AvailableSlot[] = (slots || []).map((slot: TimeSlot) => ({
        id: slot.id,
        time: slot.start_time,
        coach_id: coachId as string,
        coach_name: coach?.name || "",
        coach_specialty: coach?.specialty || "",
      }))

      return NextResponse.json(availableSlots)
    }
  } catch (error) {
    console.error("Availability error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    return NextResponse.json({ error: "Internal server error", details: errorMessage }, { status: 500 })
  }
}
