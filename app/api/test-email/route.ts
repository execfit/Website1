import { NextResponse } from "next/server"
import { Resend } from "resend"

export async function GET() {
  try {
    console.log("Testing Resend API key...")
    console.log("API Key exists:", !!process.env.RESEND_API_KEY)
    console.log("API Key starts with 're_':", process.env.RESEND_API_KEY?.startsWith("re_"))

    const resend = new Resend(process.env.RESEND_API_KEY)

    const { data, error } = await resend.emails.send({
      from: "ExecFit Test <onboarding@resend.dev>",
      to: ["white.c.bla@gmail.com"], // Replace with YOUR actual email
      subject: "🎉 ExecFit Email Test - Success!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #000;">Email System Working! 🚀</h1>
          <p style="color: #666;">If you're reading this, your Resend integration is working perfectly.</p>
          <p style="color: #666;">Your cookbook distribution system is ready to go!</p>
        </div>
      `,
    })

    if (error) {
      console.error("Resend error:", error)
      return NextResponse.json({ success: false, error: error }, { status: 400 })
    }

    return NextResponse.json({ success: true, data, message: "Test email sent successfully!" })
  } catch (error) {
    console.error("Test email error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
