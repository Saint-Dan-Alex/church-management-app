import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

export const metadata: Metadata = {
  title: "CEAA - Ministère auprès ds Enfants et Adolescents",
  description: "Système de gestion pour le Ministère auprès des Enfants et Adolescents",
  generator: "v0.app",
  icons: {
    icon: [
      { url: "/logo-arche.png" },
      { url: "/logo-arche.png", sizes: "32x32", type: "image/png" },
      { url: "/logo-arche.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/logo-arche.png" },
    ],
    shortcut: ["/logo-arche.png"],
  },
  openGraph: {
    title: "Centre Evangélique Arche de l'Alliance",
    description: "Ministère auprès des Enfants et Adolescents",
    images: ["/logo-arche.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
        <Toaster />
      </body>
    </html>
  )
}
