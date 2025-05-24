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
  keywords: "fitness, nutrition, coaching, executive, premium, health, wellness, cookbooks",
  authors: [{ name: "ExecFit" }],
  creator: "ExecFit",
  publisher: "ExecFit",

  // Open Graph tags for social sharing
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://execfitnow.com",
    siteName: "ExecFit",
    title: "ExecFit - Premium Fitness & Nutrition Coaching",
    description:
      "Premium fitness and nutrition coaching tailored for high-performing professionals who demand excellence in every aspect of life.",
    images: [
      {
        url: "/images/fulllogo.png",
        width: 1200,
        height: 630,
        alt: "ExecFit - Premium Fitness & Nutrition Coaching",
      },
    ],
  },

  // Twitter Card tags
  twitter: {
    card: "summary_large_image",
    title: "ExecFit - Premium Fitness & Nutrition Coaching",
    description:
      "Premium fitness and nutrition coaching tailored for high-performing professionals who demand excellence in every aspect of life.",
    images: ["/images/fulllogo.png"],
    creator: "@execfitboston",
  },

  // Favicon and icons
  icons: {
    icon: [
      { url: "/images/icononly.jpg", sizes: "32x32", type: "image/jpeg" },
      { url: "/images/icononly.jpg", sizes: "16x16", type: "image/jpeg" },
    ],
    apple: [{ url: "/images/icononly.jpg", sizes: "180x180", type: "image/jpeg" }],
    shortcut: "/images/icononly.jpg",
  },

  // Additional meta tags
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Verification tags (add these if you have them)
  verification: {
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${montserrat.variable} ${raleway.variable}`}>
      <head>
        {/* Additional meta tags for better SEO */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <link rel="canonical" href="https://execfitnow.com" />
      </head>
      <body className={montserrat.className}>{children}</body>
    </html>
  )
}
