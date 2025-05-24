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
  try {
    const body: ConsultationRequest = await request.json()

    // Validate required fields
    if (
      !body.client_name ||
      !body.client_email ||
      !body.client_phone ||
      !body.consultation_date ||
      !body.consultation_time
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // If no coach preference, we'll assign based on availability
    const consultationData = {
      coach_id: body.coach_id || null,
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

    const result = await bookConsultation(consultationData)

    if (result.success) {
      return NextResponse.json(result.data)
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
  } catch (error) {
    console.error("Error booking consultation:", error)
    const errorMessage = error instanceof Error ? error.message : "Internal server error"

    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
