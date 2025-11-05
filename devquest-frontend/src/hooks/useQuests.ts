// src/hooks/useQuests.ts
'use client'

import { useState, useEffect } from 'react'
import { questApi } from '@/lib/quest-api'
import { Quest, QuestWithStatus, FilterType } from '@/types/quest'

interface UseQuestsProps {
  userId: string | undefined
  token: string | undefined
  mode?: 'all' | 'my'
}

export const useQuests = ({ userId, token, mode = 'all' }: UseQuestsProps) => {
  const [quests, setQuests] = useState<Quest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<FilterType>('All')

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalQuests, setTotalQuests] = useState(0)
  const itemsPerPage = 10

  const fetchQuests = async () => {
    if (!token) {
      setError('No authentication token')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      let data

      if (mode === 'my') {
        data = await questApi.getMyQuests(token)
      } else {
        data = await questApi.getQuests(token, {
          page: currentPage,
          limit: itemsPerPage,
        })
      }

      setQuests(data.items || [])
      setTotalPages(data.meta?.totalPages || 1)
      setTotalQuests(data.meta?.total || 0)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch quests')
    } finally {
      setLoading(false)
    }
  }

  // Fetch when token or page changes
  useEffect(() => {
    fetchQuests()
  }, [token, mode, currentPage])

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [filter])

  const questsWithStatus: QuestWithStatus[] = quests.map((quest) => ({
    ...quest,
    status: quest.completedBy.includes(userId || '') ? 'Solved' : 'Unsolved',
  }))

  const filteredQuests =
    filter === 'All'
      ? questsWithStatus
      : questsWithStatus.filter((q) => q.status === filter)

  return {
    quests: filteredQuests,
    allQuests: questsWithStatus,
    loading,
    error,
    filter,
    setFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    totalQuests,
    refetch: fetchQuests,
  }
}
