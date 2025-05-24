import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

interface Coach {
  id: string
  name: string
}

interface TimeSlot {
  coach_id: string
  date: string
  start_time: string
  end_time: string
  is_available: boolean
}

export async function POST() {
  try {
    // Get all coaches
    const { data: coaches, error: coachesError } = await supabase.from("coaches").select("id, name")

    if (coachesError) {
      return NextResponse.json({ error: "Failed to fetch coaches", details: coachesError.message }, { status: 500 })
    }

    console.log("Found coaches:", coaches)

    // Delete existing time slots
    const { error: deleteError } = await supabase.from("time_slots").delete().neq("id", "")

    if (deleteError) {
      console.error("Error deleting time slots:", deleteError)
    }

    // Create time slots for all coaches
    const timeSlots: TimeSlot[] = []

    if (coaches && coaches.length > 0) {
      for (const coach of coaches as Coach[]) {
        console.log(`Creating slots for coach: ${coach.name} (${coach.id})`)

        for (let i = 1; i <= 30; i++) {
          const date = new Date()
          date.setDate(date.getDate() + i)
          const dateString = date.toISOString().split("T")[0]

          // Skip weekends
          if (date.getDay() === 0 || date.getDay() === 6) continue

          // Add time slots for each weekday
          const slots = ["09:00:00", "10:00:00", "11:00:00", "14:00:00", "15:00:00", "16:00:00", "17:00:00"]

          for (const time of slots) {
            const endTime = time.replace(
              /(\d{2}):(\d{2}):(\d{2})/,
              (_, h, m, s) => `${String(Number.parseInt(h) + 1).padStart(2, "0")}:${m}:${s}`,
            )

            timeSlots.push({
              coach_id: coach.id,
              date: dateString,
              start_time: time,
              end_time: endTime,
              is_available: true,
            })
          }
        }
      }
    }

    console.log(`Total time slots to create: ${timeSlots.length}`)

    // Insert time slots in batches
    const batchSize = 100
    let insertedCount = 0

    for (let i = 0; i < timeSlots.length; i += batchSize) {
      const batch = timeSlots.slice(i, i + batchSize)
      const { error: insertError } = await supabase.from("time_slots").insert(batch)

      if (insertError) {
        console.error("Error inserting batch:", insertError)
      } else {
        insertedCount += batch.length
        console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}, total: ${insertedCount}`)
      }
    }

    return NextResponse.json({
      success: true,
      message: "Time slots regenerated successfully!",
      coaches: coaches?.length || 0,
      timeSlots: insertedCount,
      details: {
        coachesFound: coaches?.map((c: Coach) => ({ id: c.id, name: c.name })) || [],
        totalSlotsCreated: insertedCount,
      },
    })
  } catch (error) {
    console.error("Error fixing time slots:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    return NextResponse.json({ error: "Internal server error", details: errorMessage }, { status: 500 })
  }
}
