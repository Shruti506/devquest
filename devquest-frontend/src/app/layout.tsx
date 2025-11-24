// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "@/lib/theme";
import { decodeToken } from "@/lib/auth";
import Navbar from "@/components/header/Navbar";
import { Toaster } from "react-hot-toast";
import { UserProvider } from "@/context/UserProvider";
import { getServerToken } from "@/lib/auth-server";
import { DEFAULT_SEO } from "@/lib/seo.config";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  ...DEFAULT_SEO,
  title: {
    default: "DevQuest - Gamified Coding Platform",
    template: "%s | DevQuest",
  },
  description:
    "Embark on coding quests, enhance your development skills, and track your progress with DevQuest — the gamified platform for developers.",
  keywords: [
    "coding quests",
    "developer challenges",
    "programming platform",
    "gamified learning",
    "web development",
  ],
  authors: [{ name: "DevQuest Team" }],
};

export default async function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const token = await getServerToken();
  const decoded = token ? decodeToken(token) : null;
  const userEmail = decoded?.sub || null;

  return (
    <html lang="en">
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
  );
}