import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

export async function initializeSchedulingDatabase() {
  try {
    console.log("Initializing scheduling database...")

    // Create coaches table
    const { error: coachesError } = await supabase.from("coaches").select("id").limit(1)

    if (coachesError && coachesError.code === "42P01") {
      // Table doesn't exist, we'll need to create it via the API endpoint
      console.log("Tables need to be created. Please visit /api/init-db endpoint.")
      return { success: false, message: "Please initialize database via /api/init-db endpoint" }
    }

    // Insert sample coaches if they don't exist
    const { data: existingCoaches } = await supabase.from("coaches").select("email")

    if (!existingCoaches || existingCoaches.length === 0) {
      const { error: insertError } = await supabase.from("coaches").insert([
        {
          name: "Gabriela Garcia",
          email: "gabriela@execfitnow.com",
          specialty: "Personal Trainer | Nutrition Coach",
          image: "/images/coach-gabriela.jpg",
        },
        {
          name: "Maddy Gold",
          email: "maddy@execfitnow.com",
          specialty: "Certified Personal Trainer | PN1 Nutrition Coach",
          image: "/images/coach-maddy.jpg",
        },
        {
          name: "Yosof Abuhasan",
          email: "yosof@execfitnow.com",
          specialty: "Physique/Strength Training/Mindset Coaching",
          image: "/images/coach-yosof.jpg",
        },
      ])

      if (insertError) {
        console.error("Error inserting coaches:", insertError)
        return { success: false, error: insertError.message }
      }

      console.log("Sample coaches inserted successfully")
    }

    // Generate time slots for the next 30 days
    const { data: coaches } = await supabase.from("coaches").select("id").eq("is_active", true)

    if (coaches && coaches.length > 0) {
      const timeSlots = []

      for (const coach of coaches) {
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

      // Insert time slots in batches
      const batchSize = 100
      for (let i = 0; i < timeSlots.length; i += batchSize) {
        const batch = timeSlots.slice(i, i + batchSize)
        const { error: timeSlotsError } = await supabase.from("time_slots").upsert(batch, {
          onConflict: "coach_id,date,start_time",
          ignoreDuplicates: true,
        })

        if (timeSlotsError) {
          console.error("Error inserting time slots batch:", timeSlotsError)
        }
      }

      console.log(`Generated time slots for ${coaches.length} coaches`)
    }

    return {
      success: true,
      message: "Scheduling database initialized successfully",
      coaches: coaches?.length || 0,
    }
  } catch (error) {
    console.error("Error initializing scheduling database:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    return { success: false, error: errorMessage }
  }
}
