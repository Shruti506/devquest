import LeaderboardModal from '@/components/leaderboard/LeaderboardModal'
import { getServerToken } from '@/lib/auth-server'
import { redirect } from 'next/navigation'

export default async function InterceptedLeaderboard() {
  const token = await getServerToken()

  if (!token) {
    redirect('/login')
  }

  return <LeaderboardModal token={token} />
}
