// app/leaderboard/page.tsx
import LeaderboardModal from "@/components/leaderboard/LeaderboardModal";
import { getServerToken } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { generatePageMetadata } from "@/lib/seo.config";

export const metadata = generatePageMetadata({
  title: "Leaderboard",
  description: "View the global DevQuest leaderboard and see how you rank among top developers.",
  path: "/leaderboard",
  keywords: ["leaderboard", "top coders", "rankings"],
});

export default async function LeaderboardPage() {
  const token = await getServerToken();
  if (!token) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-100 pt-8">
      <div className="max-w-2xl mx-auto">
        <LeaderboardModal token={token} />
      </div>
    </div>
  );
}