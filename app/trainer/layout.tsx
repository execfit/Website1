"use client"

import type React from "react"

interface TrainerProfile {
  id: string
  name: string
  email: string
  specialty: string
  bio: string
  session_rate: number
  profile_image: string
}

export default function TrainerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div style={{ backgroundColor: "white", minHeight: "100vh" }}>{children}</div>
}
