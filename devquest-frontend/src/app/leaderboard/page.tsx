import LeaderboardModal from '@/components/leaderboard/LeaderboardModal'
import { getServerToken } from '@/lib/auth-server'
import { redirect } from 'next/navigation'

export default async function LeaderboardPage() {
  const token = await getServerToken()

  if (!token) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-8">
      <div className="max-w-2xl mx-auto">
        <LeaderboardModal token={token} />
      </div>
    </div>
  )
}
