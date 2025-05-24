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

  // Filter out already booked slots
  const bookedSlots = await getBookedSlots(coachId, date)
  const bookedTimes = bookedSlots.map((slot) => slot.consultation_time)

  return data?.filter((slot) => !bookedTimes.includes(slot.start_time)) || []
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

// Book a consultation
export async function bookConsultation(consultation: Omit<Consultation, "id" | "created_at" | "updated_at">) {
  try {
    // Check if slot is still available (if coach is specified)
    if (consultation.coach_id) {
      const isAvailable = await checkSlotAvailability(
        consultation.coach_id,
        consultation.consultation_date,
        consultation.consultation_time,
      )

      if (!isAvailable) {
        throw new Error("This time slot is no longer available")
      }
    }

    const { data, error } = await supabase.from("consultations").insert([consultation]).select().single()

    if (error) throw error

    // Send confirmation email
    await sendConsultationConfirmation(data)

    return { success: true, data }
  } catch (error) {
    console.error("Error booking consultation:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    return { success: false, error: errorMessage }
  }
}

// Check if a time slot is available
export async function checkSlotAvailability(coachId: string, date: string, time: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("consultations")
    .select("id")
    .eq("coach_id", coachId)
    .eq("consultation_date", date)
    .eq("consultation_time", time)
    .in("status", ["pending", "confirmed"])

  if (error) {
    console.error("Error checking availability:", error)
    return false
  }

  return data.length === 0
}

// Send consultation confirmation email
export async function sendConsultationConfirmation(consultation: Consultation) {
  try {
    const response = await fetch("/api/send-consultation-confirmation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(consultation),
    })

    if (!response.ok) {
      throw new Error("Failed to send confirmation email")
    }

    return { success: true }
  } catch (error) {
    console.error("Error sending confirmation:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    return { success: false, error: errorMessage }
  }
}
