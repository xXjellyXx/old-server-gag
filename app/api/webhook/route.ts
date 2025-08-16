import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, timestamp } = body

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 })
    }

    // Log the submission (you can replace this with your actual webhook logic)
    console.log(`[${timestamp}] New username submission: ${username}`)

    // Here you would typically send this data to your external webhook
    // For now, we'll just return success

    return NextResponse.json({ message: "Username submitted successfully", username }, { status: 200 })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
