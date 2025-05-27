import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email, trainer_name, temporary_password, specialty } = await request.json()

    if (!email || !trainer_name || !temporary_password) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const { data, error } = await resend.emails.send({
      from: "noreply@execfitnow.com",
      to: [email],
      subject: "Welcome to ExecFit - Your Trainer Account Invitation",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>ExecFit Trainer Invitation</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
          <div style="background: linear-gradient(135deg, #000000 0%, #333333 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Welcome to ExecFit!</h1>
            <p style="color: #e0e0e0; margin: 10px 0 0 0; font-size: 16px;">Your trainer account is ready</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #000; margin-top: 0; font-weight: bold;">Hi ${trainer_name},</h2>
            
            <p style="color: #333;">Congratulations! You've been invited to join the ExecFit trainer team. We're excited to have you on board!</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #000; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #000; font-weight: bold;">Your Login Credentials</h3>
              <p style="color: #333;"><strong>Email:</strong> ${email}</p>
              <p style="color: #333;"><strong>Temporary Password:</strong> <code style="background: #e9ecef; padding: 4px 8px; border-radius: 4px; font-family: monospace; color: #000; border: 1px solid #ddd;">${temporary_password}</code></p>
              <p style="color: #333;"><strong>Specialty:</strong> ${specialty}</p>
            </div>
            
            <div style="background: #f8f9fa; border: 1px solid #dee2e6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #333;"><strong>⚠️ Important:</strong> This is a temporary password. You'll be prompted to create a new secure password when you first log in.</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/trainer/login" 
                 style="background: #000; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; transition: background-color 0.3s;">
                Login to Your Account
              </a>
            </div>
            
            <h3 style="color: #000; font-weight: bold;">Next Steps:</h3>
            <ol style="padding-left: 20px; color: #333;">
              <li>Click the login button above or visit <strong>${process.env.NEXT_PUBLIC_BASE_URL}/trainer/login</strong></li>
              <li>Use your email and temporary password to log in</li>
              <li>Create a new secure password</li>
              <li>Complete your trainer profile</li>
              <li>Start managing your clients and sessions!</li>
            </ol>
            
            <div style="background: #f8f9fa; border: 1px solid #dee2e6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #333;"><strong>Need Help?</strong> If you have any questions or need assistance, please contact our support team.</p>
            </div>
            
            <p style="margin-top: 30px; color: #333;">Welcome to the team!</p>
            <p style="color: #000;"><strong>The ExecFit Team</strong></p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
            <p>This invitation expires in 30 days. Please log in soon to activate your account.</p>
            <p>© ${new Date().getFullYear()} ExecFit. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error("Resend error:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    console.log("✅ Trainer invitation email sent successfully:", data)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("❌ Error sending trainer invitation email:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error occurred" },
      { status: 500 },
    )
  }
}
