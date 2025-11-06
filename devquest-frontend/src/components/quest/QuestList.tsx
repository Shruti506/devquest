'use client'

import { useState } from 'react'
import { useQuests } from '@/hooks/useQuests'
import { CircularProgress } from '@mui/material'
import { questApi } from '@/lib/quest-api'
import { QuestFilters } from './QuestFilters'
import { QuestCard } from './QuestCard'
import { QuestPagination } from './QuestPagination'
import { AddQuestModal } from './AddQuestModal'
import { QuestHeader } from './QuestHeader'
import toast from 'react-hot-toast'

interface QuestListProps {
  userId: string | undefined
  token: string | undefined
  mode?: 'all' | 'my'
}

export const QuestList = ({ userId, token, mode = 'all' }: QuestListProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const {
    quests,
    loading,
    error,
    filter,
    setFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    totalQuests,
    refetch,
  } = useQuests({ userId, token, mode })

  const handleCreateQuest = async (data: any) => {
    if (!token) return

    try {
      await questApi.createQuest(token, data)
      await refetch()
      toast.success('Quest created successfully!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create quest')
    }
  }

  if (loading && quests.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <CircularProgress />
      </div>
    )
  }

  if (error) {
    toast.error(error)
  }

  return (
    <div>
      <div className="max-w-6xl mx-auto sticky top-16 z-40 flex justify-between items-center bg-gray-50 py-4 px-4">
        <QuestHeader />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        <QuestFilters activeFilter={filter} onFilterChange={setFilter} />

        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <CircularProgress />
          </div>
        ) : quests.length === 0 ? (
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
                ? mode === 'my'
                  ? 'Start by creating your first quest'
                  : 'No quests available at the moment'
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

            <QuestPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />

            <div className="text-center mt-4 text-sm text-gray-500">
              Showing {quests.length} of {totalQuests} quests
            </div>
          </>
        )}

        <AddQuestModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateQuest}
        />
      </div>
    </div>
  )
}
