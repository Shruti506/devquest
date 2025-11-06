import { redirect } from 'next/navigation'
import { getServerToken, decodeToken } from '@/lib/auth'
import DashboardContent from '@/components/dashboard/DashboardContent'

export const metadata = {
  title: 'Dashboard - Your App',
  description: 'Your dashboard',
}

export default async function DashboardPage() {
  const token = await getServerToken()

  if (!token) {
    redirect('/login')
  }

  const decoded = decodeToken(token)
  const userEmail = decoded?.email || 'User'

  return (
    <div className="bg-gray-50 p-4">
      <DashboardContent />
    </div>
  )
}
