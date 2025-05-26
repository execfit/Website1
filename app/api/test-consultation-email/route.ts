import { NextResponse } from "next/server"
import { Resend } from "resend"

export async function GET() {
  try {
    console.log("🧪 Testing consultation email configuration...")

    // Check environment variables
    const hasResendKey = !!process.env.RESEND_API_KEY
    const apiKey = process.env.RESEND_API_KEY

    console.log("📧 Resend API Key exists:", hasResendKey)
    console.log("📧 API Key starts with 're_':", apiKey?.startsWith("re_"))
    console.log("📧 API Key length:", apiKey?.length)

    if (!hasResendKey) {
      return NextResponse.json({
        success: false,
        error: "RESEND_API_KEY environment variable not found",
        instructions: [
          "1. Add your Resend API key to environment variables",
          "2. Make sure it starts with 're_'",
          "3. Restart your application after adding the key",
        ],
      })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    console.log("📧 Sending test email...")

    // Use a simple test email first
    const { data, error } = await resend.emails.send({
      from: "ExecFit <onboarding@resend.dev>", // Using Resend's default domain
      to: ["delivered@resend.dev"], // Resend's test email that always works
      subject: "🧪 ExecFit Email Test - System Check",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #000;">Email System Test 🎉</h1>
          <p>If you're reading this, your ExecFit email system is configured correctly!</p>
          
          <div style="background: #f0f0f0; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>System Status:</h3>
            <p>✅ Resend API Key: Valid</p>
            <p>✅ Email Service: Working</p>
            <p>✅ Consultation Emails: Ready</p>
          </div>
          
          <p style="color: #666;">This was a test email from your ExecFit consultation booking system.</p>
          <p><strong>Next step:</strong> Try booking a consultation to test the full email flow.</p>
        </div>
      `,
    })

    if (error) {
      console.error("❌ Test email failed:", error)
      return NextResponse.json({
        success: false,
        error: "Test email failed",
        details: error,
        troubleshooting: [
          "1. Check if your Resend API key is valid",
          "2. Verify you're not in Resend's sandbox mode",
          "3. Check Resend dashboard for any issues",
          "4. Try regenerating your API key",
        ],
      })
    }

    console.log("✅ Test email sent successfully:", data)

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully!",
      emailId: data?.id,
      instructions: [
        "1. Check delivered@resend.dev received the test email",
        "2. If successful, the email system is working",
        "3. Try booking a consultation to test the full flow",
        "4. Check your spam folder for consultation emails",
      ],
    })
  } catch (error) {
    console.error("💥 Test email error:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      details: error instanceof Error ? error.stack : "No stack trace",
    })
  }
}
