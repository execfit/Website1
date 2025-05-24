import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role for admin operations
)

export async function POST() {
  try {
    // Create coaches table
    const { error: coachesError } = await supabase.rpc("create_coaches_table_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS coaches (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          specialty TEXT,
          image VARCHAR(500),
          timezone VARCHAR(50) DEFAULT 'America/New_York',
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    if (coachesError) {
      console.log("Coaches table might already exist:", coachesError.message)
    }

    // Create time_slots table
    const { error: timeSlotsError } = await supabase.rpc("create_time_slots_table_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS time_slots (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
          date DATE NOT NULL,
          start_time TIME NOT NULL,
          end_time TIME NOT NULL,
          is_available BOOLEAN DEFAULT true,
          is_recurring BOOLEAN DEFAULT false,
          recurring_pattern VARCHAR(50),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(coach_id, date, start_time)
        );
      `,
    })

    if (timeSlotsError) {
      console.log("Time slots table might already exist:", timeSlotsError.message)
    }

    // Create consultations table
    const { error: consultationsError } = await supabase.rpc("create_consultations_table_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS consultations (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          coach_id UUID REFERENCES coaches(id),
          client_name VARCHAR(255) NOT NULL,
          client_email VARCHAR(255) NOT NULL,
          client_phone VARCHAR(50) NOT NULL,
          consultation_date DATE NOT NULL,
          consultation_time TIME NOT NULL,
          duration_minutes INTEGER DEFAULT 30,
          status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
          client_goals TEXT,
          client_experience VARCHAR(50),
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    if (consultationsError) {
      console.log("Consultations table might already exist:", consultationsError.message)
    }

    // Insert sample coaches
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
      }
    }

    // Get coaches for time slot creation
    const { data: coaches } = await supabase.from("coaches").select("id").eq("is_active", true)

    if (coaches && coaches.length > 0) {
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

      // Insert time slots in batches
      const batchSize = 100
      for (let i = 0; i < timeSlots.length; i += batchSize) {
        const batch = timeSlots.slice(i, i + batchSize)
        const { error: timeSlotsInsertError } = await supabase.from("time_slots").upsert(batch, {
          onConflict: "coach_id,date,start_time",
          ignoreDuplicates: true,
        })

        if (timeSlotsInsertError) {
          console.error("Error inserting time slots batch:", timeSlotsInsertError)
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully!",
      coaches: coaches?.length || 0,
      timeSlots: "Generated for next 30 days",
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
