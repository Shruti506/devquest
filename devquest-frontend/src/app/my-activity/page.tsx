// app/activity/page.tsx
import ActivityLogPage from "@/components/activity/ActivityLog";
import { decodeToken } from "@/lib/auth";
import { getServerToken } from "@/lib/auth-server";
import { generatePageMetadata } from "@/lib/seo.config";

export const metadata = generatePageMetadata({
  title: "Activity Log",
  description: "Track your coding quests, achievements, and milestones.",
  path: "/my-activity",
  keywords: ["activity log", "progress tracking", "achievements"],
});

export default async function ActivityLog() {
  const token = await getServerToken();
  const decoded = token ? decodeToken(token) : null;
  const userId = decoded?.sub || null;

  if (!token || !userId) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <ActivityLogPage userId={userId} token={token} />
      </div>
    </div>
  );
}