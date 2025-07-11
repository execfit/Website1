"use client"

import { redirect } from "next/navigation"

export default function StartPage() {
  // Server-side redirect - this happens before the page renders
  redirect("https://start.execfitnow.com/assessment/2188494")
}
