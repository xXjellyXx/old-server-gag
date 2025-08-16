import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get("username")

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 })
  }

  try {
    const userResponse = await fetch(`https://users.roblox.com/v1/usernames/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      body: JSON.stringify({
        usernames: [username],
        excludeBannedUsers: true,
      }),
    })

    if (!userResponse.ok) {
      console.log("[v0] User API response not ok:", userResponse.status)
      throw new Error("Failed to get user by username")
    }

    const userData = await userResponse.json()
    console.log("[v0] User data received:", userData)

    if (!userData.data || userData.data.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const user = userData.data[0]
    const userId = user.id

    // Get additional user details including avatar
    const detailsResponse = await fetch(`https://users.roblox.com/v1/users/${userId}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    })

    let userDetails = user
    if (detailsResponse.ok) {
      userDetails = await detailsResponse.json()
    }

    // Get user avatar
    const avatarResponse = await fetch(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png&isCircular=false`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      },
    )

    let avatarUrl = "/roblox-avatar.png"
    if (avatarResponse.ok) {
      const avatarData = await avatarResponse.json()
      console.log("[v0] Avatar data received:", avatarData)
      if (avatarData.data && avatarData.data.length > 0) {
        avatarUrl = avatarData.data[0].imageUrl
        console.log("[v0] Avatar URL:", avatarUrl)
      }
    } else {
      console.log("[v0] Avatar API response not ok:", avatarResponse.status)
    }

    return NextResponse.json({
      ...userDetails,
      avatarUrl,
    })
  } catch (error) {
    console.error("[v0] Error fetching Roblox user:", error)
    return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 })
  }
}
