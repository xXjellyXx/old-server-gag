import type React from "react"
import type { Metadata } from "next"
import { Nunito_Sans, Fredoka } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunito",
  weight: ["400", "600", "700", "800", "900"],
})

const fredoka = Fredoka({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fredoka",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Grow a Garden - Find Old Servers",
  description: "Join old Grow a Garden servers on Roblox",
  generator: "v0.app",
  openGraph: {
    title: "Grow a Garden - Find Old Servers",
    description: "Join old Grow a Garden servers on Roblox",
    url: "https://growagarden-serverfinder.vercel.app/",
    images: [
      {
        url: "https://growagarden-serverfinder.vercel.app/thumbnail.jpg", // Public folder image
        width: 1200,
        height: 620,
        alt: "Grow a Garden Thumbnail",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Grow a Garden - Find Old Servers",
    description: "Join old Grow a Garden servers on Roblox",
    images: ["https://growagarden-serverfinder.vercel.app/thumbnail.jpg"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${nunitoSans.variable} ${fredoka.variable}`}>
      <head>
        <style>{`
html {
  font-family: ${nunitoSans.style.fontFamily};
  --font-sans: ${nunitoSans.style.fontFamily};
  --font-display: ${fredoka.style.fontFamily};
}
        `}</style>
      </head>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
