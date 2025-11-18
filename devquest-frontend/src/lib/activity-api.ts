// src/lib/activity-api.ts
import { ActivityApiResponse, ActivityFilters } from '@/types/activity'
import { apiClient } from './api-client'

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

    return apiClient.get<ActivityApiResponse>(
      `/progress/activity-log?${query.toString()}`,
      { token },
    )
  },
}
