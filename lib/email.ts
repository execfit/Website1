import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export interface SendCookbookEmailParams {
  to: string
  cookbookId: string
  cookbookTitle: string
}

export async function sendCookbookEmail({ to, cookbookId, cookbookTitle }: SendCookbookEmailParams) {
  try {
    console.log("Starting email send process...")
    console.log("To:", to)
    console.log("Cookbook ID:", cookbookId)

    // Check if API key exists
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY environment variable is not set")
    }

    // Determine the base URL - prioritize deployed domain
    let baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL

    // If we have a Vercel URL but no protocol, add https://
    if (baseUrl && !baseUrl.startsWith("http")) {
      baseUrl = `https://${baseUrl}`
    }

    // Fallback to localhost only in development
    if (!baseUrl) {
      baseUrl = "http://localhost:3000"
      console.warn("⚠️  No deployment URL found, using localhost")
    }

    // Log the URL being used for debugging
    console.log("📧 Email download URL will be:", baseUrl)

    // Use the simpler download route with query parameters
    const downloadUrl = `${baseUrl}/api/download-cookbook?id=${cookbookId}`

    console.log("Download URL:", downloadUrl)
    console.log("Sending email via Resend...")

    const { data, error } = await resend.emails.send({
      from: "ExecFit <noreply@execfitnow.com>",
      to: [to],
      subject: `Your ${cookbookTitle} is Ready! 🍽️`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #000; margin-bottom: 10px; font-size: 28px;">Thank You for Following @execfitboston!</h1>
            <p style="color: #666; font-size: 16px;">Your premium cookbook download is ready.</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #000;">
            <h2 style="color: #000; margin-bottom: 15px; font-size: 22px;">${cookbookTitle}</h2>
            <p style="color: #666; line-height: 1.6; font-size: 16px;">
              You now have access to premium nutrition recipes designed specifically for high-performing professionals. 
              Each recipe includes detailed macronutrient information and preparation tips.
            </p>
          </div>

          <div style="text-align: center; margin: 35px 0;">
            <a href="${downloadUrl}" 
               style="background: #000; 
                      color: white; 
                      padding: 18px 36px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      font-weight: bold;
                      font-size: 18px;
                      display: inline-block;
                      box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
              📥 Download Your Cookbook
            </a>
            <p style="color: #666; font-size: 14px; margin-top: 12px;">
              Click the button above to download your PDF cookbook directly to your device
            </p>
          </div>

          <div style="margin-bottom: 30px; background: #f9f9f9; padding: 20px; border-radius: 6px;">
            <h3 style="color: #000; margin-bottom: 15px;">What's Next?</h3>
            <ul style="color: #666; line-height: 1.8; margin: 0; padding-left: 20px;">
              <li>Download and save your cookbook PDF</li>
              <li>Try your first recipe this week</li>
              <li>Follow us on Instagram for daily nutrition tips</li>
              <li>Share your cooking results with #ExecFitNutrition</li>
            </ul>
          </div>

          <div style="text-align: center; margin-bottom: 25px;">
            <a href="https://instagram.com/execfitboston" 
               style="background: linear-gradient(45deg, #833ab4, #fd1d1d, #fcb045); 
                      color: white; 
                      padding: 12px 24px; 
                      text-decoration: none; 
                      border-radius: 6px; 
                      font-weight: bold;
                      display: inline-block;">
              📱 Follow @execfitboston
            </a>
          </div>

          <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center; color: #999; font-size: 14px;">
            <p style="margin: 5px 0;">You're receiving this because you requested a free cookbook from ExecFit.</p>
            <p style="margin: 5px 0;">© ${new Date().getFullYear()} ExecFit. All rights reserved.</p>
            <p style="margin: 5px 0;">
              <a href="mailto:noreply@execfitnow.com" style="color: #666;">Contact us</a> | 
              <a href="https://execfitnow.com" style="color: #666;">Visit our website</a>
            </p>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error("Resend API error:", error)
      throw new Error(`Resend API error: ${JSON.stringify(error)}`)
    }

    console.log("Email sent successfully:", data)
    return { success: true, data }
  } catch (error) {
    console.error("Error in sendCookbookEmail:", error)
    throw error
  }
}
