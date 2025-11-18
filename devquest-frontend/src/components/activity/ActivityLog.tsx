'use client'

import { useState, useEffect } from 'react'
import { activityApi } from '@/lib/activity-api'
import {
  ActivityLog,
  ActivityFilters as ActivityFiltersType,
} from '@/types/activity'
import ActivityList from '@/components/activity/ActivityList'
import ActivityFilters from '@/components/activity/ActivityFilters'
import {
  Activity,
  Award,
  CheckCircle,
  Sparkles,
  TrendingUp,
} from 'lucide-react'

interface ActivityLogProps {
  userId: string | undefined
  token: string | undefined
}

const ActivityLogPage = ({ userId, token }: ActivityLogProps) => {
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalActivities, setTotalActivities] = useState(0)

  const [filters, setFilters] = useState<ActivityFiltersType>({
    page: 1,
    limit: 10,
    activityType: 'all',
  })

  const fetchActivities = async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await activityApi.getActivityLog(token, filters)
      setActivities(response.items)
      setCurrentPage(response.meta.page)
      setTotalPages(response.meta.totalPages)
      setTotalActivities(response.meta.total)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch activities',
      )
      console.error('Error fetching activities:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchActivities()
  }, [filters])

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleFilterChange = (newFilters: ActivityFiltersType) => {
    setFilters(newFilters)
  }

  // Calculate stats
  const stats = {
    total: totalActivities,
    completed: activities.filter((a) => a.activityType === 'quest_completed')
      .length,
    badges: activities.filter((a) => a.activityType === 'badge_earned').length,
    levelUps: activities.filter((a) => a.activityType === 'level_up').length,
    totalXP: activities
      .filter((a) => a.activityType === 'quest_completed')
      .reduce((sum, a) => sum + (a.metadata?.xp || 0), 0),
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Activity Log</h1>
              <p className="text-gray-600 mt-1">
                Track your quest progress, achievements, and milestones
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-red-600 font-semibold">Error</span>
            </div>
            <p className="text-red-700 mb-3">{error}</p>
            <button
              onClick={fetchActivities}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Activity List */}
        <ActivityList
          activities={activities}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}

export default ActivityLogPage
