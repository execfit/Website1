import { type NextRequest, NextResponse } from "next/server"
import { sendCookbookEmail } from "@/lib/email"
import { saveEmailSubscriber } from "@/lib/simple-storage" // ✅ This file exists and works

export async function POST(request: NextRequest) {
  try {
    console.log("=== COOKBOOK API ROUTE STARTED ===")

    const body = await request.json()
    console.log("Request body:", body)

    const { email, cookbookId, cookbookTitle } = body

    // Validate input
    if (!email || !cookbookId || !cookbookTitle) {
      console.log("Missing required fields:", {
        email: !!email,
        cookbookId: !!cookbookId,
        cookbookTitle: !!cookbookTitle,
      })
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log("Invalid email format:", email)
      return NextResponse.json({ success: false, message: "Invalid email format" }, { status: 400 })
    }

    console.log("Validation passed, saving to database...")

    // Save to simple storage (file-based)
    try {
      await saveEmailSubscriber({
        email,
        cookbook_id: cookbookId,
        cookbook_title: cookbookTitle,
        source: "cookbook-download",
        is_active: true,
      })
      console.log("Email subscriber saved successfully")
    } catch (dbError) {
      console.error("Database save error:", dbError)
      // Continue anyway - don't fail the email send if database fails
    }

    console.log("Sending email...")

    // Send the email with cookbook attachment
    const emailResult = await sendCookbookEmail({
      to: email,
      cookbookId,
      cookbookTitle,
    })

    console.log("Email sent successfully:", emailResult)

    return NextResponse.json({
      success: true,
      message: "Cookbook sent successfully",
      data: emailResult.data,
    })
  } catch (error) {
    console.error("=== COOKBOOK API ERROR ===")
    console.error("Error details:", error)
    console.error("Error message:", error instanceof Error ? error.message : "Unknown error")
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack")

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to send cookbook",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
