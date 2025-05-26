import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET() {
  return new Response(
    `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Initialize Database</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
        button { background: #0070f3; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 16px; }
        button:hover { background: #0051cc; }
        .result { margin-top: 20px; padding: 15px; border-radius: 6px; }
        .success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
      </style>
    </head>
    <body>
      <h1>Initialize ExecFit Database</h1>
      <p>Click the button below to set up your consultation booking system:</p>
      <button onclick="initializeDatabase()">Initialize Database</button>
      <div id="result"></div>
      
      <script>
        async function initializeDatabase() {
          const button = document.querySelector('button');
          const result = document.getElementById('result');
          
          button.disabled = true;
          button.textContent = 'Initializing...';
          result.innerHTML = '';
          
          try {
            const response = await fetch('/api/init-db', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' }
            });
            
            const data = await response.json();
            
            if (data.success) {
              result.className = 'result success';
              result.innerHTML = '<strong>Success!</strong><br>' + data.message + '<br>Coaches: ' + data.coaches + '<br>Time Slots: ' + data.timeSlots;
            } else {
              result.className = 'result error';
              result.innerHTML = '<strong>Error:</strong><br>' + data.error;
              if (data.instructions) {
                result.innerHTML += '<br><br><strong>Instructions:</strong><br>' + data.instructions.join('<br>');
              }
            }
          } catch (error) {
            result.className = 'result error';
            result.innerHTML = '<strong>Error:</strong><br>' + error.message;
          }
          
          button.disabled = false;
          button.textContent = 'Initialize Database';
        }
      </script>
    </body>
    </html>
    `,
    {
      headers: {
        "Content-Type": "text/html",
      },
    },
  )
}

export async function POST() {
  try {
    console.log("🚀 Starting database initialization with specific coach IDs...")

    // First, clear existing data to avoid conflicts
    console.log("🧹 Clearing existing data...")

    // Delete existing time slots
    const { error: deleteTimeSlotsError } = await supabase.from("time_slots").delete().neq("id", "")
    if (deleteTimeSlotsError) {
      console.log("⚠️ Error deleting time slots (might not exist):", deleteTimeSlotsError.message)
    }

    // Delete existing consultations
    const { error: deleteConsultationsError } = await supabase.from("consultations").delete().neq("id", "")
    if (deleteConsultationsError) {
      console.log("⚠️ Error deleting consultations (might not exist):", deleteConsultationsError.message)
    }

    // Delete existing coaches
    const { error: deleteCoachesError } = await supabase.from("coaches").delete().neq("id", "")
    if (deleteCoachesError) {
      console.log("⚠️ Error deleting coaches (might not exist):", deleteCoachesError.message)
    }

    // Insert coaches with specific string IDs
    console.log("👥 Inserting coaches with specific IDs...")
    const { data: coaches, error: insertError } = await supabase
      .from("coaches")
      .insert([
        {
          id: "gabriela",
          name: "Gabriela Garcia",
          email: "gabriela@execfitnow.com",
          specialty: "Personal Trainer | Nutrition Coach",
          image: "/images/coach-gabriela.jpg",
          is_active: true,
        },
        {
          id: "maddy",
          name: "Maddy Gold",
          email: "maddy@execfitnow.com",
          specialty: "Certified Personal Trainer | PN1 Nutrition Coach",
          image: "/images/coach-maddy.jpg",
          is_active: true,
        },
        {
          id: "yosof",
          name: "Yosof Abuhasan",
          email: "yosof@execfitnow.com",
          specialty: "Physique/Strength Training/Mindset Coaching",
          image: "/images/coach-yosof.jpg",
          is_active: true,
        },
      ])
      .select()

    if (insertError) {
      console.error("❌ Error inserting coaches:", insertError)
      return NextResponse.json(
        {
          success: false,
          error: insertError.message,
        },
        { status: 500 },
      )
    }

    console.log("✅ Coaches inserted successfully:", coaches?.length)

    // Generate time slots for the next 30 days
    console.log("📅 Generating time slots...")
    const timeSlots = []
    const coachIds = ["gabriela", "maddy", "yosof"]

    for (const coachId of coachIds) {
      console.log(`📋 Creating slots for coach: ${coachId}`)

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
            coach_id: coachId,
            date: dateString,
            start_time: time,
            end_time: endTime,
            is_available: true,
          })
        }
      }
    }

    console.log(`📊 Total time slots to create: ${timeSlots.length}`)

    // Insert time slots in batches
    const batchSize = 100
    let insertedCount = 0

    for (let i = 0; i < timeSlots.length; i += batchSize) {
      const batch = timeSlots.slice(i, i + batchSize)
      const { error: timeSlotsInsertError } = await supabase.from("time_slots").insert(batch)

      if (timeSlotsInsertError) {
        console.error("❌ Error inserting time slots batch:", timeSlotsInsertError)
        // Continue with next batch instead of failing completely
      } else {
        insertedCount += batch.length
        console.log(`✅ Inserted batch ${Math.floor(i / batchSize) + 1}, total: ${insertedCount}`)
      }
    }

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully with specific coach IDs!",
      coaches: coaches?.length || 0,
      timeSlots: insertedCount,
      details: {
        coachIds: coachIds,
        totalSlotsCreated: insertedCount,
        dateRange: "Next 30 days (weekdays only)",
        timeSlots: "9AM-11AM, 2PM-5PM",
      },
    })
  } catch (error) {
    console.error("💥 Error initializing database:", error)
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
