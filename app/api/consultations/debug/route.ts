import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const coachId = searchParams.get("coach_id")
    const date = searchParams.get("date")
    const time = searchParams.get("time")

    console.log("🔍 Debug consultation booking:", { coachId, date, time })

    // Get coaches
    const { data: coaches, error: coachesError } = await supabase.from("coaches").select("*")

    // Get time slots for the date
    const { data: timeSlots, error: timeSlotsError } = await supabase
      .from("time_slots")
      .select("*")
      .eq("date", date || new Date().toISOString().split("T")[0])
      .order("start_time")

    // Get existing consultations for the date
    const { data: consultations, error: consultationsError } = await supabase
      .from("consultations")
      .select("*")
      .eq("consultation_date", date || new Date().toISOString().split("T")[0])
      .order("consultation_time")

    // If specific coach and time provided, check availability
    let availabilityCheck = null
    if (coachId && date && time) {
      const { data: specificSlot } = await supabase
        .from("time_slots")
        .select("*")
        .eq("coach_id", coachId)
        .eq("date", date)
        .eq("start_time", time)
        .single()

      const { data: existingBooking } = await supabase
        .from("consultations")
        .select("*")
        .eq("coach_id", coachId)
        .eq("consultation_date", date)
        .eq("consultation_time", time)
        .in("status", ["pending", "confirmed"])

      availabilityCheck = {
        timeSlotExists: !!specificSlot,
        timeSlotData: specificSlot,
        existingBookings: existingBooking || [],
        isAvailable: !existingBooking || existingBooking.length === 0,
      }
    }

    return NextResponse.json({
      success: true,
      debug: {
        coaches: coaches || [],
        timeSlots: timeSlots || [],
        consultations: consultations || [],
        availabilityCheck,
        errors: {
          coachesError: coachesError?.message,
          timeSlotsError: timeSlotsError?.message,
          consultationsError: consultationsError?.message,
        },
        summary: {
          totalCoaches: coaches?.length || 0,
          totalTimeSlots: timeSlots?.length || 0,
          totalConsultations: consultations?.length || 0,
        },
      },
    })
  } catch (error) {
    console.error("Debug error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
