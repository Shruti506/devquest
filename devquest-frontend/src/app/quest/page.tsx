// app/quests/page.tsx
import { QuestList } from "@/components/quest/QuestList";
import { decodeToken } from "@/lib/auth";
import { getServerToken } from "@/lib/auth-server";
import { generatePageMetadata } from "@/lib/seo.config";

export const metadata = generatePageMetadata({
  title: "Coding Quests",
  description: "Browse and start new coding quests to level up your development skills.",
  path: "/quests",
  keywords: ["coding quests", "challenges", "programming tasks"],
});

export default async function QuestPage() {
  const token = await getServerToken();
  const decoded = token ? decodeToken(token) : null;
  const userId = decoded?.sub || null;

  if (!token || !userId) return null;

  return <QuestList userId={userId} token={token} />;
}