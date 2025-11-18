// src/lib/leaderboard-api.ts
import { UserRankResponse, LeaderboardResponse } from '@/types/leaderboard'
import { apiClient } from './api-client'

export const leaderboardApi = {
  async getLeaderboard(
    token: string,
    {
      scope = 'global',
      page = 1,
      limit = 10,
      sort = 'desc',
    }: {
      scope?: 'global' | 'weekly' | 'monthly'
      page?: number
      limit?: number
      sort?: 'asc' | 'desc'
    } = {},
  ): Promise<LeaderboardResponse> {
    const params = new URLSearchParams({
      scope,
      page: String(page),
      limit: String(limit),
      sort,
    })

    return apiClient.get<LeaderboardResponse>(
      `/leaderboard?${params.toString()}`,
      {
        token,
      },
    )
  },

  async getMyRank(token: string): Promise<UserRankResponse> {
    return apiClient.get<UserRankResponse>('/leaderboard/my-rank', {
      token,
    })
  },
}