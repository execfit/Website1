import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Client Waiver and Release of Liability - ExecFit",
  description:
    "Complete legal waiver and release of liability document for ExecFit personal training and wellness services.",
  robots: {
    index: true,
    follow: true,
  },
}

export default function WaiverLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
