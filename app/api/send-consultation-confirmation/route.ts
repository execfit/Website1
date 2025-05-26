import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    console.log("📧 Consultation confirmation email endpoint called")

    const consultation = await request.json()
    console.log("📋 Consultation data received:", {
      id: consultation.id,
      client_name: consultation.client_name,
      client_email: consultation.client_email,
      consultation_date: consultation.consultation_date,
      consultation_time: consultation.consultation_time,
      coach_id: consultation.coach_id,
    })

    // Check if Resend API key exists
    if (!process.env.RESEND_API_KEY) {
      console.error("❌ RESEND_API_KEY not found in environment variables")
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 })
    }

    console.log("✅ Resend API key found, length:", process.env.RESEND_API_KEY.length)

    const formatDate = (dateString: string) => {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    }

    const formatTime = (timeString: string) => {
      const [hours, minutes] = timeString.split(":")
      const date = new Date()
      date.setHours(Number.parseInt(hours), Number.parseInt(minutes))
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    }

    // Get coach name
    const getCoachName = (coachId: string | null) => {
      const coaches = {
        gabriela: "Gabriela Garcia",
        maddy: "Maddy Gold",
        yosof: "Yosof Abuhasan",
      }
      return coachId ? coaches[coachId as keyof typeof coaches] || "Assigned Coach" : "Best Available Coach"
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Consultation Confirmed - ExecFit</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #000 0%, #333 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Consultation Confirmed! 🎉</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your free fitness consultation has been scheduled</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Hi ${consultation.client_name},</h2>
            
            <p>Thank you for booking your free consultation with ExecFit! We're excited to help you achieve your fitness goals.</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #000;">
              <h3 style="margin-top: 0; color: #000;">📅 Consultation Details</h3>
              <p><strong>Date:</strong> ${formatDate(consultation.consultation_date)}</p>
              <p><strong>Time:</strong> ${formatTime(consultation.consultation_time)}</p>
              <p><strong>Duration:</strong> 30 minutes</p>
              <p><strong>Coach:</strong> ${getCoachName(consultation.coach_id)}</p>
              <p><strong>Booking ID:</strong> ${consultation.id}</p>
            </div>
            
            <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #007acc; margin-top: 0;">📞 Meeting Details</h3>
              <p>We'll send you the video call link 24 hours before your consultation.</p>
              <p>Please ensure you have a stable internet connection and a quiet space for our call.</p>
            </div>
            
            <h3>What to Expect:</h3>
            <ul>
              <li>✅ Comprehensive fitness assessment</li>
              <li>✅ Discussion of your goals and challenges</li>
              <li>✅ Personalized recommendations</li>
              <li>✅ Overview of our coaching programs</li>
              <li>✅ Q&A session</li>
            </ul>
            
            <div style="background: #000; color: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <p style="margin: 0; font-size: 16px;">Need to reschedule or have questions?</p>
              <p style="margin: 5px 0 0 0;">Reply to this email or visit our website</p>
            </div>
            
            <p>We look forward to speaking with you soon!</p>
            
            <p style="margin-top: 30px;">
              Best regards,<br>
              <strong>The ExecFit Team</strong>
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
            <p>ExecFit - Premium Fitness Coaching</p>
            <p>This email was sent to ${consultation.client_email}</p>
          </div>
        </body>
      </html>
    `

    console.log("📧 Attempting to send email to:", consultation.client_email)

    // Send client confirmation email using your professional domain
    const { data: clientEmailData, error: clientEmailError } = await resend.emails.send({
      from: "ExecFit <noreply@execfitnow.com>", // Using your professional domain
      to: [consultation.client_email],
      subject: "Your ExecFit Consultation is Confirmed! 🎯",
      html: emailHtml,
    })

    if (clientEmailError) {
      console.error("❌ Error sending client email:", clientEmailError)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to send confirmation email",
          details: clientEmailError,
          troubleshooting: [
            "Check if email address is valid",
            "Verify Resend API key is correct",
            "Check Resend dashboard for delivery status",
          ],
        },
        { status: 500 },
      )
    }

    console.log("✅ Client email sent successfully:", clientEmailData)

    return NextResponse.json({
      success: true,
      message: "Confirmation email sent successfully",
      emailId: clientEmailData?.id,
      recipient: consultation.client_email,
    })
  } catch (error) {
    console.error("💥 Error in consultation confirmation endpoint:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send confirmation email",
        details: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : "No stack trace",
      },
      { status: 500 },
    )
  }
}
