// src/components/quest/QuestList.tsx
'use client'

import { useState, useMemo } from 'react'
import { useQuests } from '@/hooks/useQuests'
import { CircularProgress, Alert } from '@mui/material'
import { questApi } from '@/lib/quest-api'
import { QuestFilters } from './QuestFilters'
import { QuestCard } from './QuestCard'
import { QuestPagination } from './QuestPagination'
import { AddQuestModal } from './AddQuestModal'
import { Plus } from 'lucide-react'

interface QuestListProps {
  userId: string | undefined
  token: string | undefined
}

export const QuestList = ({ userId, token }: QuestListProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const {
    quests,
    allQuests,
    loading,
    error,
    filter,
    setFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    totalQuests,
    refetch,
  } = useQuests({ userId, token })

  const counts = useMemo(() => {
    return {
      all: allQuests.length,
      solved: allQuests.filter((q) => q.status === 'Solved').length,
      unsolved: allQuests.filter((q) => q.status === 'Unsolved').length,
    }
  }, [allQuests])

  const handleCreateQuest = async (data: any) => {
    if (!token) return

    try {
      await questApi.createQuest(token, data)
      await refetch()
    } catch (err) {
      throw err
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <CircularProgress />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quests</h1>
          <p className="text-gray-600 mt-1">
            Complete quests to earn rewards and level up
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Quest
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" className="mb-6">
          {error}
        </Alert>
      )}

      {/* Filters */}
      <QuestFilters
        activeFilter={filter}
        onFilterChange={setFilter}
        counts={counts}
      />

      {/* Quest Grid */}
      {quests.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No quests found
          </h3>
          <p className="text-gray-600">
            {filter === 'All'
              ? 'Start by creating your first quest'
              : `No ${filter.toLowerCase()} quests available`}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quests.map((quest) => (
              <QuestCard key={quest._id} quest={quest} />
            ))}
          </div>

          {/* Pagination */}
          <QuestPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />

          {/* Quest Count */}
          <div className="text-center mt-4 text-sm text-gray-500">
            Showing {quests.length} of {totalQuests} quests
          </div>
        </>
      )}

      {/* Add Quest Modal */}
      <AddQuestModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateQuest}
      />
    </div>
  )
}
