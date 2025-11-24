// app/dashboard/page.tsx
import { redirect } from "next/navigation";
import { decodeToken } from "@/lib/auth";
import DashboardContent from "@/components/dashboard/DashboardContent";
import { getServerToken } from "@/lib/auth-server";
import { generatePageMetadata } from "@/lib/seo.config";

export const metadata = generatePageMetadata({
  title: "Dashboard",
  description: "View your coding progress, achievements, and active quests on DevQuest.",
  path: "/dashboard",
  keywords: ["dashboard", "coding progress", "developer stats"],
});

export default async function DashboardPage() {
  const token = await getServerToken();
  if (!token) redirect("/login");

  const decoded = decodeToken(token);
  const userEmail = decoded?.email || "User";

  return (
    <div className="bg-gray-50 p-4">
      <DashboardContent />
    </div>
  );
}