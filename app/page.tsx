"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Sparkles, CheckCircle, Loader2 } from "lucide-react"

interface RobloxUser {
  id: number
  name: string
  displayName: string
  description: string
  created: string
  isBanned: boolean
  externalAppDisplayName: string | null
  hasVerifiedBadge: boolean
  avatarUrl: string | null
}

export default function HomePage() {
  const [username, setUsername] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [robloxUser, setRobloxUser] = useState<RobloxUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showServerProcess, setShowServerProcess] = useState(false)
  const [processStep, setProcessStep] = useState(-1) // Start at -1 so first step shows loading
  const [showJoinButton, setShowJoinButton] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (showServerProcess) {
      const processSteps = ["Connecting to account...", "Finding old servers...", "Awaiting final confirmation..."]

      // Start first step immediately
      if (processStep === -1) {
        const timer = setTimeout(() => {
          setProcessStep(0)
        }, 500)
        return () => clearTimeout(timer)
      }

      // Progress through steps
      if (processStep >= 0 && processStep < processSteps.length - 1) {
        const timer = setTimeout(() => {
          setProcessStep(processStep + 1)
        }, 1200) // Increased delay for better visual effect
        return () => clearTimeout(timer)
      }

      // Show join button after final step
      if (processStep === processSteps.length - 1) {
        const timer = setTimeout(() => {
          setShowJoinButton(true)
        }, 1500) // Wait longer before showing join button
        return () => clearTimeout(timer)
      }
    }
  }, [showServerProcess, processStep])

  const fetchRobloxUser = async (username: string) => {
    setIsLoading(true)
    try {
      console.log("[v0] Fetching user:", username)

      const response = await fetch(`/api/roblox-user?username=${encodeURIComponent(username)}`)

      console.log("[v0] Response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch user")
      }

      const userData = await response.json()
      console.log("[v0] User data received:", userData)

      setRobloxUser(userData)
      setShowServerProcess(true)
      setProcessStep(-1) // Reset to -1 to start animation sequence
    } catch (error) {
      console.log("[v0] Error fetching user:", error)
      toast({
        title: "User Not Found",
        description: "Could not find a Roblox user with that username",
        variant: "destructive",
      })
      setRobloxUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username.trim()) {
      toast({
        title: "Username Required",
        description: "Please enter your Roblox username",
        variant: "destructive",
      })
      return
    }

    setShowServerProcess(false)
    setShowJoinButton(false)
    setProcessStep(-1) // Reset step counter

    await fetchRobloxUser(username.trim())
  }

  const handlePetGenerator = () => {
    window.open("https://v0-pet-generator-growagarden.vercel.app/", "_blank")
  }

  const handleJoinServer = () => {
    window.open(
      "https://www.roblox.com/games/126884695634066/Grow-a-Garden?privateServerLinkCode=881224362243473110549436889722",
      "_blank",
    )
  }

  const processSteps = ["Connecting to account...", "Finding old servers...", "Awaiting final confirmation..."]

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: "url(/grow-a-garden-bg.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 w-full max-w-md">
        <Card className="bg-white/95 backdrop-blur-sm border-4 border-yellow-400 shadow-2xl">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h1
                className="text-4xl font-bold text-yellow-500 mb-2"
                style={{
                  textShadow: "3px 3px 0px #000, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000",
                }}
              >
                FIND OLD SERVERS
              </h1>
              <h2
                className="text-2xl font-bold text-red-600 mb-4"
                style={{
                  textShadow: "2px 2px 0px #000, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000",
                }}
              >
                GROW A GARDEN
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-bold text-gray-700 mb-2">
                  Roblox Username
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username..."
                  className="text-lg p-3 border-2 border-gray-300 focus:border-yellow-400 focus:ring-yellow-400"
                  disabled={isSubmitting || isLoading}
                />
              </div>

              {robloxUser && (
                <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src={robloxUser.avatarUrl || `/roblox-avatar.png`}
                        alt={robloxUser.displayName}
                        onError={(e) => {
                          console.log("[v0] Avatar image failed to load for user:", robloxUser.id)
                          e.currentTarget.src = "/roblox-avatar.png"
                        }}
                      />
                      <AvatarFallback>
                        {robloxUser.displayName?.charAt(0) || robloxUser.name?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg">{robloxUser.displayName || robloxUser.name}</h3>
                        {robloxUser.hasVerifiedBadge && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            ✓ Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">@{robloxUser.name}</p>
                    </div>
                  </div>
                  {robloxUser.description && <p className="text-sm text-gray-700 mb-2">{robloxUser.description}</p>}
                  <p className="text-xs text-gray-500">Joined: {new Date(robloxUser.created).toLocaleDateString()}</p>
                </div>
              )}

              {showServerProcess && (
                <div className="bg-white rounded-lg p-6 border-2 border-gray-300 shadow-lg">
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Finalizing Process</h3>
                    <Avatar className="w-16 h-16 mx-auto mb-4">
                      <AvatarImage
                        src={robloxUser?.avatarUrl || `/roblox-avatar.png`}
                        alt={robloxUser?.displayName}
                        onError={(e) => {
                          console.log("[v0] Modal avatar image failed to load for user:", robloxUser?.id)
                          e.currentTarget.src = "/roblox-avatar.png"
                        }}
                      />
                      <AvatarFallback>
                        {robloxUser?.displayName?.charAt(0) || robloxUser?.name?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="space-y-3 mb-6">
                    {processSteps.map((step, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        {index < processStep ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : index === processStep ? (
                          <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-gray-300" />
                        )}
                        <span className={`text-sm ${index <= processStep ? "text-gray-800" : "text-gray-400"}`}>
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>

                  {showJoinButton && (
                    <Button
                      onClick={handleJoinServer}
                      className="w-full text-lg font-bold py-3 bg-green-600 hover:bg-green-700 text-white"
                    >
                      JOIN SERVER
                    </Button>
                  )}
                </div>
              )}

              {!showServerProcess && (
                <Button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="w-full text-lg font-bold py-3 bg-green-600 hover:bg-green-700 text-white border-2 border-green-800 shadow-lg transform transition-transform hover:scale-105"
                >
                  {isLoading ? "Loading User..." : isSubmitting ? "Submitting..." : "FIND OLD SERVERS!"}
                </Button>
              )}
            </form>

            <div className="mt-4">
              <Button
                onClick={handlePetGenerator}
                variant="outline"
                className="w-full text-lg font-bold py-3 bg-purple-600 hover:bg-purple-700 text-white border-2 border-purple-800 shadow-lg transform transition-transform hover:scale-105"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                PET GENERATOR
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
