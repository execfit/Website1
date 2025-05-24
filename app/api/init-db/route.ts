import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    // Since we can't create tables directly with the anon key,
    // let's just insert the coaches data and return success

    // Check if coaches already exist
    const { data: existingCoaches, error: checkError } = await supabase.from("coaches").select("email").limit(1)

    if (checkError) {
      // If table doesn't exist, we'll get an error
      console.log("Coaches table might not exist yet:", checkError.message)

      return NextResponse.json(
        {
          success: false,
          message: "Database tables need to be created manually in Supabase dashboard",
          error: "Please create the tables in your Supabase dashboard first",
          instructions: [
            "1. Go to your Supabase dashboard",
            "2. Navigate to the SQL Editor",
            "3. Run the SQL commands to create the tables",
            "4. Then run this endpoint again to populate data",
          ],
        },
        { status: 400 },
      )
    }

    // Insert sample coaches if they don't exist
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
        return NextResponse.json(
          {
            success: false,
            error: insertError.message,
          },
          { status: 500 },
        )
      }
    }

    // Get coaches for time slot creation
    const { data: coaches, error: coachesError } = await supabase.from("coaches").select("id").eq("is_active", true)

    if (coachesError) {
      return NextResponse.json(
        {
          success: false,
          error: coachesError.message,
        },
        { status: 500 },
      )
    }

    if (coaches && coaches.length > 0) {
      // Check if time slots already exist
      const { data: existingSlots } = await supabase.from("time_slots").select("id").limit(1)

      if (!existingSlots || existingSlots.length === 0) {
        // Insert sample time slots for the next 30 days
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

        // Insert time slots in smaller batches
        const batchSize = 50
        let insertedCount = 0

        for (let i = 0; i < timeSlots.length; i += batchSize) {
          const batch = timeSlots.slice(i, i + batchSize)
          const { error: timeSlotsInsertError } = await supabase.from("time_slots").insert(batch)

          if (timeSlotsInsertError) {
            console.error("Error inserting time slots batch:", timeSlotsInsertError)
            // Continue with next batch instead of failing completely
          } else {
            insertedCount += batch.length
          }
        }

        return NextResponse.json({
          success: true,
          message: "Database initialized successfully!",
          coaches: coaches.length,
          timeSlots: `${insertedCount} time slots created for next 30 days`,
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: "Database already initialized!",
      coaches: coaches?.length || 0,
      timeSlots: "Already exists",
    })
  } catch (error) {
    console.error("Error initializing database:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 },
    )
  }
}
