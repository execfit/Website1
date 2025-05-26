import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export interface Coach {
  id: string
  name: string
  email: string
  specialty: string
  image: string
  timezone: string
  is_active: boolean
  calendar_id?: string
}

export interface TimeSlot {
  id: string
  coach_id: string
  date: string
  start_time: string
  end_time: string
  is_available: boolean
  is_recurring: boolean
  recurring_pattern?: string
}

export interface Consultation {
  id?: string
  coach_id?: string | null
  client_name: string
  client_email: string
  client_phone: string
  consultation_date: string
  consultation_time: string
  duration_minutes: number
  status: "pending" | "confirmed" | "cancelled" | "completed"
  client_goals?: string | null
  client_experience?: string | null
  notes?: string | null
  calendar_event_id?: string | null
  meeting_link?: string | null
  created_at?: string
  updated_at?: string
}

// Get all active coaches
export async function getCoaches(): Promise<Coach[]> {
  const { data, error } = await supabase.from("coaches").select("*").eq("is_active", true).order("name")

  if (error) {
    console.error("Error fetching coaches:", error)
    return []
  }

  return data || []
}

// Get available time slots for a coach on a specific date
export async function getAvailableSlots(coachId: string, date: string) {
  try {
    console.log(`🔍 Getting available slots for coach ${coachId} on ${date}`)

    // Get base time slots from database
    const { data, error } = await supabase
      .from("time_slots")
      .select("*")
      .eq("coach_id", coachId)
      .eq("date", date)
      .eq("is_available", true)
      .order("start_time")

    if (error) {
      console.error("Error fetching time slots:", error)
      return []
    }

    console.log(`📅 Found ${data?.length || 0} base time slots`)

    // Get already booked consultations
    const bookedSlots = await getBookedSlots(coachId, date)
    const bookedTimes = bookedSlots.map((slot) => slot.consultation_time)

    console.log(`🚫 Booked times: ${bookedTimes.join(", ")}`)

    // Filter out booked slots
    const availableSlots =
      data?.filter((slot) => {
        return !bookedTimes.includes(slot.start_time)
      }) || []

    console.log(`✅ Available slots: ${availableSlots.length}`)

    return availableSlots
  } catch (error) {
    console.error("Error getting available slots:", error)
    return []
  }
}

// Get all available slots across all coaches for "no preference"
export async function getAllAvailableSlots(date: string) {
  const coaches = await getCoaches()
  const allSlots = []

  for (const coach of coaches) {
    const slots = await getAvailableSlots(coach.id, date)
    for (const slot of slots) {
      allSlots.push({
        ...slot,
        coach_name: coach.name,
        coach_specialty: coach.specialty,
      })
    }
  }

  return allSlots.sort((a, b) => a.start_time.localeCompare(b.start_time))
}

// Get booked consultations for a coach on a specific date
export async function getBookedSlots(coachId: string, date: string) {
  const { data, error } = await supabase
    .from("consultations")
    .select("*")
    .eq("coach_id", coachId)
    .eq("consultation_date", date)
    .in("status", ["pending", "confirmed"])

  if (error) {
    console.error("Error fetching booked slots:", error)
    return []
  }

  return data || []
}

// Check if a time slot is available
export async function checkSlotAvailability(coachId: string, date: string, time: string): Promise<boolean> {
  try {
    console.log(`🔍 Checking availability for coach ${coachId} on ${date} at ${time}`)

    // First check if the time slot exists in the time_slots table
    const { data: timeSlot, error: timeSlotError } = await supabase
      .from("time_slots")
      .select("*")
      .eq("coach_id", coachId)
      .eq("date", date)
      .eq("start_time", time)
      .eq("is_available", true)
      .single()

    if (timeSlotError || !timeSlot) {
      console.log("❌ Time slot not found in time_slots table:", timeSlotError?.message)
      // Don't fail here - the slot might still be bookable even if not in time_slots table
    } else {
      console.log("✅ Time slot found in time_slots table")
    }

    // Check for existing bookings at this time
    const { data: existingBookings, error: bookingError } = await supabase
      .from("consultations")
      .select("id, status")
      .eq("coach_id", coachId)
      .eq("consultation_date", date)
      .eq("consultation_time", time)
      .in("status", ["pending", "confirmed"])

    if (bookingError) {
      console.error("❌ Error checking existing bookings:", bookingError)
      return false
    }

    const isAvailable = !existingBookings || existingBookings.length === 0
    console.log(
      `📊 Availability check result: ${isAvailable ? "AVAILABLE" : "BOOKED"} (${existingBookings?.length || 0} existing bookings)`,
    )

    return isAvailable
  } catch (error) {
    console.error("💥 Error in checkSlotAvailability:", error)
    return false
  }
}

// Book a consultation
export async function bookConsultation(consultation: Omit<Consultation, "id" | "created_at" | "updated_at">) {
  try {
    console.log("💾 Starting consultation booking process")
    console.log("📋 Consultation data:", {
      coach_id: consultation.coach_id,
      client_name: consultation.client_name,
      consultation_date: consultation.consultation_date,
      consultation_time: consultation.consultation_time,
    })

    // Only check availability if coach is specified (not for "no preference")
    if (consultation.coach_id) {
      console.log(`🔍 Checking availability for specific coach: ${consultation.coach_id}`)
      const isAvailable = await checkSlotAvailability(
        consultation.coach_id,
        consultation.consultation_date,
        consultation.consultation_time,
      )

      if (!isAvailable) {
        console.log("❌ Time slot no longer available")
        throw new Error("This time slot is no longer available")
      }
      console.log("✅ Time slot is available")
    } else {
      console.log("🎯 No specific coach preference - skipping availability check")
    }

    // Insert consultation into database
    console.log("💾 Inserting consultation into database")
    const { data, error } = await supabase.from("consultations").insert([consultation]).select().single()

    if (error) {
      console.error("❌ Database insert error:", error)
      throw error
    }

    console.log("✅ Consultation inserted successfully:", data.id)

    // Send confirmation email
    console.log("📧 Sending confirmation email")
    const emailResult = await sendConsultationConfirmation(data)

    if (emailResult.success) {
      console.log("✅ Confirmation email sent successfully")
    } else {
      console.log("⚠️ Email sending failed:", emailResult.error)
      // Don't fail the booking if email fails
    }

    return { success: true, data }
  } catch (error) {
    console.error("💥 Error booking consultation:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    return { success: false, error: errorMessage }
  }
}

// Send consultation confirmation email
export async function sendConsultationConfirmation(consultation: Consultation) {
  try {
    console.log("📧 Attempting to send confirmation email to:", consultation.client_email)

    const response = await fetch("/api/send-consultation-confirmation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(consultation),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ Email API response not ok:", response.status, errorText)
      throw new Error(`Failed to send confirmation email: ${response.status}`)
    }

    const result = await response.json()
    console.log("✅ Email API response:", result)

    return { success: true }
  } catch (error) {
    console.error("💥 Error sending confirmation:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    return { success: false, error: errorMessage }
  }
}
