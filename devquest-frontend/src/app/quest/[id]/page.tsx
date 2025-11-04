// src/app/quest/[id]/page.tsx
import { redirect } from 'next/navigation'
import { getServerToken, decodeToken } from '@/lib/auth'
import { QuestDetail } from '@/components/quest/QuestDetail'

interface QuestDetailPageProps {
  params: {
    id: string
  }
}

export const metadata = {
  title: 'Quest Details',
  description: 'View quest details and progress',
}

export default async function QuestDetailPage({
  params,
}: QuestDetailPageProps) {
  const token = await getServerToken()

  if (!token) {
    redirect('/login')
  }

  // Decode token to get userId
  const decoded = decodeToken(token)
  const userId = decoded?.sub || decoded?.userId

  return <QuestDetail questId={params.id} token={token} userId={userId} />
}
