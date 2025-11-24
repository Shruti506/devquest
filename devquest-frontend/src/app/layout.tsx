import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import theme from "@/lib/theme"
import { decodeToken } from "@/lib/auth"
import Navbar from "@/components/header/Navbar"
import { Toaster } from "react-hot-toast"
import { UserProvider } from "@/context/UserProvider"
import { getServerToken } from "@/lib/auth-server"

const inter = Inter({ subsets: ["latin"] })

// export const metadata: Metadata = {
//   title: {
//     default: "Auth App",
//     template: "%s | DevQuest",
//   },
//   description: "Secure authentication system built with Next.js and MUI",
// }

export const metadata: Metadata = {
  metadataBase: new URL("https://devquest-eosin.vercel.app/"),
  title: { default: "Dev Quest", template: "%s | DevQuest" },
  description:
    "Secure authentication system built with Next.js and MUI",
  keywords: [
    "Question",
    "Answer",
    "Coding",
    "Demo",
    "Web Development",
  ],
  authors: [{ name: "Shruh" }],
  openGraph: {
    title: "Dev Quest",
    description:
      "Secure authentication system built with Next.js and MUI",
    url: "/",
    siteName: "Dev Quest App",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Dev Quest App",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dev Quest",
    description:
      "Secure authentication system built with Next.js and MUI",
    images: ["/og-image.jpg"],
    creator: "@yourtwitterhandle",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
}

export default async function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  const token = await getServerToken()
  const decoded = token ? decodeToken(token) : null
  const userEmail = decoded?.sub || null

  return (
    <html lang="en">
      <head></head>
      <body className={inter.className}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <UserProvider token={token}>
            <div className="min-h-screen">
              <Navbar userEmail={userEmail} token={token} />

              <main>{children}</main>
              {modal}
            </div>
          </UserProvider>

          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        </ThemeProvider>
      </body>
    </html>
  )
}
