// app/quest/[id]/page.tsx
import { redirect } from "next/navigation";
import { decodeToken } from "@/lib/auth";
import { QuestDetail } from "@/components/quest/QuestDetail";
import { getServerToken } from "@/lib/auth-server";
import { generatePageMetadata } from "@/lib/seo.config";

interface QuestDetailPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: QuestDetailPageProps) {
  return generatePageMetadata({
    title: `Quest ${params.id}`,
    description: `View details and track progress for quest ${params.id}.`,
    path: `/quest/${params.id}`,
    keywords: ["quest details", "coding challenge"],
  });
}

export default async function QuestDetailPage({ params }: QuestDetailPageProps) {
  const token = await getServerToken();
  if (!token) redirect("/login");

  const decoded = decodeToken(token);
  const userId = decoded?.sub || decoded?.userId;

  return <QuestDetail questId={params.id} token={token} userId={userId} />;
}