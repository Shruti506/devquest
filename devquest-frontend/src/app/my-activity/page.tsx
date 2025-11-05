// app/activity/page.tsx

import ActivityLogPage from '@/components/activity/ActivityLog'
import { decodeToken, getServerToken } from '@/lib/auth'

const ActivityLog = async () => {
  const token = await getServerToken()
  const decoded = token ? decodeToken(token) : null
  const userId = decoded?.sub || null

  if (!token || !userId) {
    return null
  }
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <ActivityLogPage userId={userId} token={token} />
      </div>
    </div>
  )
}
export default ActivityLog


