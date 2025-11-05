import { UserRankResponse, LeaderboardResponse } from '@/types/leaderboard'

const API_BASE_URL = 'http://localhost:4000/api'

export const leaderboardApi = {
  /**
   * Get the leaderboard (global, weekly, or monthly)
   * @param token - JWT access token
   * @param scope - 'global' | 'weekly' | 'monthly'
   * @param page - page number (default: 1)
   * @param limit - items per page (default: 10)
   * @param sort - 'asc' | 'desc' (default: 'desc')
   */
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

    const response = await fetch(
      `${API_BASE_URL}/leaderboard?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      },
    )

    if (!response.ok) {
      throw new Error('Failed to fetch leaderboard')
    }

    return response.json()
  },

  /**
   * Get the current user's rank and nearby users
   * @param token - JWT access token
   */
  async getMyRank(token: string): Promise<UserRankResponse> {
    const response = await fetch(`${API_BASE_URL}/leaderboard/my-rank`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch user rank')
    }

    return response.json()
  },
}
