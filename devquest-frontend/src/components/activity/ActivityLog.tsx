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
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
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

        {/* Stats Cards */}
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Activity className="w-5 h-5 text-gray-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-600">Total Activities</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {stats.completed}
              </p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Award className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-yellow-600">
                {stats.badges}
              </p>
              <p className="text-sm text-gray-600">Badges Earned</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-purple-600">
                {stats.totalXP}
              </p>
              <p className="text-sm text-gray-600">Total XP</p>
            </div>
          </div>
        </div> */}

        {/* Additional Stats Row (optional) */}
        {/* {stats.levelUps > 0 && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600 rounded-full">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {stats.levelUps} Level Up{stats.levelUps > 1 ? 's' : ''}!
                </p>
                <p className="text-sm text-gray-600">
                  Keep up the amazing progress!
                </p>
              </div>
            </div>
          </div>
        )} */}

        {/* Filters */}
        {/* <ActivityFilters
          filters={filters}
          onFilterChange={handleFilterChange}
        /> */}

        {/* Error State */}
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
