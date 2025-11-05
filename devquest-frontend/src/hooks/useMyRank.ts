'use client'

import { useState, useEffect, useCallback } from 'react'
import { leaderboardApi } from '@/lib/leaderboard-api'
import { UserRankResponse } from '@/types/leaderboard'

export function useMyRank(token?: string | null) {
  const [userData, setUserData] = useState<UserRankResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRank = useCallback(async () => {
    if (!token) return
    try {
      setLoading(true)
      const data = await leaderboardApi.getMyRank(token)
      setUserData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch rank')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (token) fetchRank()
  }, [fetchRank, token])

  return { userData, loading, error, refetch: fetchRank }
}
