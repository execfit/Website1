import { type NextRequest, NextResponse } from "next/server"
import { bookConsultation } from "@/lib/scheduling"

interface ConsultationRequest {
  coach_id?: string
  client_name: string
  client_email: string
  client_phone: string
  consultation_date: string
  consultation_time: string
  client_goals?: string
  client_experience?: string
}

export async function POST(request: NextRequest) {
  console.log("📅 Booking consultation request received")

  try {
    const body: ConsultationRequest = await request.json()
    console.log("📋 Request data:", {
      coach_id: body.coach_id,
      client_name: body.client_name,
      client_email: body.client_email,
      consultation_date: body.consultation_date,
      consultation_time: body.consultation_time,
    })

    // Validate required fields
    if (
      !body.client_name ||
      !body.client_email ||
      !body.client_phone ||
      !body.consultation_date ||
      !body.consultation_time
    ) {
      console.log("❌ Missing required fields")
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.client_email)) {
      console.log("❌ Invalid email format")
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // If no coach preference, we'll assign based on availability
    const consultationData = {
      coach_id: body.coach_id === "no-preference" ? null : body.coach_id,
      client_name: body.client_name,
      client_email: body.client_email,
      client_phone: body.client_phone,
      consultation_date: body.consultation_date,
      consultation_time: body.consultation_time,
      duration_minutes: 30,
      status: "pending" as const,
      client_goals: body.client_goals || null,
      client_experience: body.client_experience || null,
    }

    console.log("💾 Attempting to book consultation:", consultationData)

    const result = await bookConsultation(consultationData)

    console.log("📊 Booking result:", result)

    if (result.success) {
      console.log("✅ Consultation booked successfully")

      // EXPLICITLY try to send email here as a backup
      console.log("🔄 Attempting to send confirmation email as backup...")
      try {
        const emailResponse = await fetch(`${request.nextUrl.origin}/api/send-consultation-confirmation`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(result.data),
        })

        const emailResult = await emailResponse.json()
        console.log("📧 Backup email attempt result:", emailResult)

        if (emailResponse.ok) {
          console.log("✅ Backup email sent successfully")
        } else {
          console.log("❌ Backup email failed:", emailResult)
        }
      } catch (emailError) {
        console.error("💥 Backup email error:", emailError)
      }

      return NextResponse.json({
        ...result.data,
        message: "Consultation booked successfully! Check your email for confirmation.",
      })
    } else {
      console.log("❌ Booking failed:", result.error)
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
  } catch (error) {
    console.error("💥 Error booking consultation:", error)
    const errorMessage = error instanceof Error ? error.message : "Internal server error"

    return NextResponse.json(
      {
        error: errorMessage,
        details: error instanceof Error ? error.stack : "Unknown error",
      },
      { status: 500 },
    )
  }
}
