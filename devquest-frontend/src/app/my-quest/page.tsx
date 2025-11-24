// app/my-quests/page.tsx
import { MyQuestList } from "@/components/my-quest/MyQuestList";
import { decodeToken } from "@/lib/auth";
import { getServerToken } from "@/lib/auth-server";
import { generatePageMetadata } from "@/lib/seo.config";

export const metadata = generatePageMetadata({
  title: "My Quests",
  description: "View and manage your personal coding quests.",
  path: "/my-quests",
  keywords: ["my quests", "personal challenges", "quest management"],
});

export default async function QuestPage() {
  const token = await getServerToken();
  const decoded = token ? decodeToken(token) : null;
  const userId = decoded?.sub || null;

  if (!token || !userId) return null;

  return <MyQuestList userId={userId} token={token} />;
}