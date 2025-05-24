// Create this file to test your Resend setup
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

async function testEmail() {
  try {
    const { data, error } = await resend.emails.send({
      from: "Test <onboarding@resend.dev>",
      to: ["your-email@example.com"], // Replace with your email
      subject: "Test Email from ExecFit",
      html: "<p>If you receive this, your Resend API key is working! 🎉</p>",
    })

    if (error) {
      console.error("Error:", error)
    } else {
      console.log("Success:", data)
    }
  } catch (error) {
    console.error("Failed:", error)
  }
}

// Uncomment to test:
// testEmail()
