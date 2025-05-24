import type React from "react"
import type { Metadata } from "next"
import { Montserrat, Raleway } from "next/font/google"
import "./globals.css"

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
})

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-raleway",
})

export const metadata: Metadata = {
  title: "ExecFit - Premium Fitness & Nutrition Coaching",
  description:
    "Premium fitness and nutrition coaching tailored for high-performing professionals who demand excellence in every aspect of life.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${montserrat.variable} ${raleway.variable}`}>
      <body className={montserrat.className}>{children}</body>
    </html>
  )
}