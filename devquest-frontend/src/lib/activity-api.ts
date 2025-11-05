// // src/lib/activity-api.ts
import { ActivityApiResponse, ActivityFilters } from '@/types/activity'

const API_BASE_URL = 'http://localhost:4000/api'

export const activityApi = {
  async getActivityLog(
    token: string,
    params?: ActivityFilters,
  ): Promise<ActivityApiResponse> {
    const query = new URLSearchParams()

    if (params?.page) query.append('page', String(params.page))
    if (params?.limit) query.append('limit', String(params.limit))

    if (params?.activityType && params.activityType !== 'all') {
      query.append('activityType', params.activityType)
    }

    if (params?.startDate) query.append('startDate', params.startDate)
    if (params?.endDate) query.append('endDate', params.endDate)

    const response = await fetch(
      `${API_BASE_URL}/progress/activity-log?${query.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      },
    )

    if (!response.ok) {
      throw new Error('Failed to fetch activity log')
    }

    return response.json()
  },
}
