import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Start Your Consultation - ExecFit",
  description: "Begin your journey with ExecFit's premium fitness and nutrition coaching.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function StartLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
