import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check environment variables
    const envCheck = {
      RESEND_API_KEY: !!process.env.RESEND_API_KEY,
      RESEND_API_KEY_FORMAT: process.env.RESEND_API_KEY?.startsWith("re_"),
      RESEND_API_KEY_LENGTH: process.env.RESEND_API_KEY?.length,
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
    }

    // Test a simple fetch to the email endpoint
    const testConsultation = {
      id: "test-123",
      client_name: "Test User",
      client_email: "test@example.com",
      client_phone: "(555) 123-4567",
      consultation_date: "2024-01-15",
      consultation_time: "10:00:00",
      coach_id: "gabriela",
      client_goals: "Test goals",
      client_experience: "beginner",
    }

    console.log("🧪 Testing email endpoint with mock data...")

    return NextResponse.json({
      success: true,
      environment: envCheck,
      testData: testConsultation,
      instructions: [
        "1. Check if RESEND_API_KEY is properly set",
        "2. Verify the API key format is correct",
        "3. Test the email endpoint manually",
      ],
      nextSteps: [
        "Visit /api/test-consultation-email to test email sending",
        "Check browser console during booking for errors",
        "Look at server logs for email-related errors",
      ],
    })
  } catch (error) {
    console.error("Debug error:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
