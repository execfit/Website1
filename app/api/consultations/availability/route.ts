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
  start_time: string
  end_time: string
  coach_name?: string
  coach_specialty?: string
}

export async function GET(request: Request) {
  console.log("🔍 Availability API called")

  try {
    const { searchParams } = new URL(request.url)
    const coachId = searchParams.get("coach_id")
    const date = searchParams.get("date")

    console.log("📋 Request params:", { coachId, date })

    if (!date) {
      console.log("❌ Missing date parameter")
      return NextResponse.json({ error: "Date is required" }, { status: 400 })
    }

    if (coachId === "no-preference") {
      console.log("🎯 Getting slots for all coaches")

      // Get all coaches
      const { data: coaches, error: coachesError } = await supabase.from("coaches").select("*")

      if (coachesError) {
        console.error("❌ Error fetching coaches:", coachesError)
        return NextResponse.json({ error: "Failed to fetch coaches", details: coachesError.message }, { status: 500 })
      }

      console.log("👥 Found coaches:", coaches?.length || 0)

      // Get time slots for all coaches
      const allSlots: AvailableSlot[] = []

      if (coaches && coaches.length > 0) {
        for (const coach of coaches as Coach[]) {
          console.log(`🔍 Getting slots for coach: ${coach.id}`)

          const { data: slots, error: slotsError } = await supabase
            .from("time_slots")
            .select("*")
            .eq("coach_id", coach.id)
            .eq("date", date)
            .eq("is_available", true)
            .order("start_time")

          if (!slotsError && slots) {
            console.log(`✅ Found ${slots.length} slots for ${coach.id}`)
            slots.forEach((slot: TimeSlot) => {
              allSlots.push({
                id: slot.id,
                start_time: slot.start_time,
                end_time: slot.end_time,
                coach_name: coach.name,
                coach_specialty: coach.specialty,
              })
            })
          } else if (slotsError) {
            console.error(`❌ Error getting slots for ${coach.id}:`, slotsError)
          }
        }
      }

      // Remove duplicates by time
      const uniqueSlots: AvailableSlot[] = []
      const seenTimes = new Set<string>()

      allSlots
        .sort((a, b) => a.start_time.localeCompare(b.start_time))
        .forEach((slot) => {
          if (!seenTimes.has(slot.start_time)) {
            seenTimes.add(slot.start_time)
            uniqueSlots.push(slot)
          }
        })

      console.log(`📊 Returning ${uniqueSlots.length} unique slots`)
      return NextResponse.json(uniqueSlots)
    } else if (coachId) {
      console.log(`🎯 Getting slots for specific coach: ${coachId}`)

      // Get time slots for specific coach
      const { data: slots, error: slotsError } = await supabase
        .from("time_slots")
        .select("*")
        .eq("coach_id", coachId)
        .eq("date", date)
        .eq("is_available", true)
        .order("start_time")

      if (slotsError) {
        console.error("❌ Error fetching time slots:", slotsError)
        return NextResponse.json({ error: "Failed to fetch time slots", details: slotsError.message }, { status: 500 })
      }

      console.log(`✅ Found ${slots?.length || 0} slots for coach ${coachId}`)

      // Get coach info
      const { data: coach, error: coachError } = await supabase.from("coaches").select("*").eq("id", coachId).single()

      if (coachError) {
        console.error("❌ Error fetching coach:", coachError)
        // Continue without coach info
      }

      const availableSlots: AvailableSlot[] = (slots || []).map((slot: TimeSlot) => ({
        id: slot.id,
        start_time: slot.start_time,
        end_time: slot.end_time,
        coach_name: coach?.name || "",
        coach_specialty: coach?.specialty || "",
      }))

      console.log(`📊 Returning ${availableSlots.length} slots`)
      return NextResponse.json(availableSlots)
    } else {
      console.log("❌ Missing coach_id parameter")
      return NextResponse.json({ error: "Coach ID is required" }, { status: 400 })
    }
  } catch (error) {
    console.error("💥 Availability error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    return NextResponse.json({ error: "Internal server error", details: errorMessage }, { status: 500 })
  }
}
