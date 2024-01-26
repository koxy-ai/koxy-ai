import "@radix-ui/themes/styles.css"
import "@/styles/global.css"
import "../theme-config.css"
import type { Metadata } from "next"
import { Theme } from "@radix-ui/themes"
import Alert from "@/components/Alert"
import { Toaster } from "@/components/ui/sonner"
import { Inter as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"

type Children = {
  children: React.ReactNode
}

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Koxy AI",
  description: "Serverless AI-powered platform",
}

export default function RootLayout({ children }: Children) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet" />
        <link rel="icon" href="/icon.png" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased dark",
          fontSans.variable
        )}
      >
        <Theme appearance="dark" radius="large" accentColor="gray" scaling="95%">
          {children}
          <Toaster />
        </Theme>
      </body>
    </html>
  )
}
