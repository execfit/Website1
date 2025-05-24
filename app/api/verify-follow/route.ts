import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { instagramHandle, businessHandle } = await request.json()

    // In a real implementation, you would:
    // 1. Use Instagram Basic Display API or Instagram Graph API
    // 2. Check if the user follows your business account
    // 3. Return the follow status

    // For demo purposes, we'll simulate the verification
    const isFollowing = Math.random() > 0.3 // 70% chance of following

    return NextResponse.json({
      isFollowing,
      message: isFollowing ? "User is following" : "User is not following",
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to verify follow status" }, { status: 500 })
  }
}
