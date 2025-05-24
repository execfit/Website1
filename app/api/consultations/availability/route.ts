import { type NextRequest, NextResponse } from "next/server"
import { getAvailableSlots, getAllAvailableSlots } from "@/lib/scheduling"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const coachId = searchParams.get("coach_id")
    const date = searchParams.get("date")

    if (!date) {
      return NextResponse.json({ error: "Date parameter is required" }, { status: 400 })
    }

    let slots
    if (coachId && coachId !== "no-preference") {
      slots = await getAvailableSlots(coachId, date)
    } else {
      slots = await getAllAvailableSlots(date)
    }

    return NextResponse.json(slots)
  } catch (error) {
    console.error("Error fetching availability:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
