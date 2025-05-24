import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const consultation = await request.json()

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
            <h1 style="margin: 0; font-size: 28px;">Consultation Confirmed!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your free fitness consultation has been scheduled</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Hi ${consultation.client_name},</h2>
            
            <p>Thank you for booking your free consultation with ExecFit! We're excited to help you achieve your fitness goals.</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #000;">
              <h3 style="margin-top: 0; color: #000;">Consultation Details</h3>
              <p><strong>Date:</strong> ${formatDate(consultation.consultation_date)}</p>
              <p><strong>Time:</strong> ${formatTime(consultation.consultation_time)}</p>
              <p><strong>Duration:</strong> 30 minutes</p>
              <p><strong>Coach:</strong> ${consultation.coach_id ? "Assigned coach will be confirmed" : "Best available coach"}</p>
              <p><strong>Format:</strong> Video call (link will be sent 24 hours before)</p>
            </div>
            
            <h3>What to Expect:</h3>
            <ul>
              <li>Comprehensive fitness assessment</li>
              <li>Discussion of your goals and challenges</li>
              <li>Personalized recommendations</li>
              <li>Overview of our coaching programs</li>
              <li>Q&A session</li>
            </ul>
            
            <h3>Before Your Consultation:</h3>
            <ul>
              <li>Think about your specific fitness goals</li>
              <li>Consider any challenges you've faced</li>
              <li>Prepare questions about our programs</li>
              <li>Ensure you have a quiet space for the call</li>
            </ul>
            
            <div style="background: #000; color: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <p style="margin: 0; font-size: 16px;">Need to reschedule or have questions?</p>
              <p style="margin: 5px 0 0 0;">Reply to this email or call us at (555) 123-4567</p>
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

    await resend.emails.send({
      from: "ExecFit <consultations@execfitnow.com>",
      to: [consultation.client_email],
      subject: "Your ExecFit Consultation is Confirmed!",
      html: emailHtml,
    })

    // Also send notification to admin/coaches
    await resend.emails.send({
      from: "ExecFit <consultations@execfitnow.com>",
      to: ["admin@execfitnow.com"], // Replace with your admin email
      subject: "New Consultation Booking",
      html: `
        <h2>New Consultation Booking</h2>
        <p><strong>Client:</strong> ${consultation.client_name}</p>
        <p><strong>Email:</strong> ${consultation.client_email}</p>
        <p><strong>Phone:</strong> ${consultation.client_phone}</p>
        <p><strong>Date:</strong> ${formatDate(consultation.consultation_date)}</p>
        <p><strong>Time:</strong> ${formatTime(consultation.consultation_time)}</p>
        <p><strong>Goals:</strong> ${consultation.client_goals || "Not specified"}</p>
        <p><strong>Experience:</strong> ${consultation.client_experience || "Not specified"}</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending confirmation email:", error)
    return NextResponse.json({ error: "Failed to send confirmation email" }, { status: 500 })
  }
}
