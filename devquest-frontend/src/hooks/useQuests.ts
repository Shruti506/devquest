// src/hooks/useQuests.ts
'use client'

import { useState, useEffect, useMemo } from 'react'
import { questApi } from '@/lib/quest-api'
import { Quest, QuestWithStatus, FilterType } from '@/types/quest'

interface UseQuestsProps {
  userId: string | undefined
  token: string | undefined
}

export const useQuests = ({ userId, token }: UseQuestsProps) => {
  const [quests, setQuests] = useState<Quest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<FilterType>('All')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const fetchQuests = async () => {
    if (!token) {
      setError('No authentication token')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const data = await questApi.getQuests(token)
      setQuests(data.items || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch quests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuests()
  }, [token])

  // Transform quests with status
  const questsWithStatus: QuestWithStatus[] = useMemo(() => {
    return quests.map((quest) => ({
      ...quest,
      status: quest.completedBy.includes(userId || '') ? 'Solved' : 'Unsolved',
    }))
  }, [quests, userId])

  // Filter quests
  const filteredQuests = useMemo(() => {
    if (filter === 'All') return questsWithStatus
    return questsWithStatus.filter((quest) => quest.status === filter)
  }, [questsWithStatus, filter])

  // Paginate quests
  const totalPages = Math.ceil(filteredQuests.length / itemsPerPage)
  const paginatedQuests = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredQuests.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredQuests, currentPage, itemsPerPage])

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [filter])

  return {
    quests: paginatedQuests,
    allQuests: questsWithStatus,
    loading,
    error,
    filter,
    setFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    totalQuests: filteredQuests.length,
    refetch: fetchQuests,
  }
}
