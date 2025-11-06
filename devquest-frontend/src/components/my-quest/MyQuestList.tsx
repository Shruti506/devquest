'use client'

import { useMemo, useState } from 'react'
import { QuestHeader } from '../quest/QuestHeader'
import { AddQuestModal } from '../quest/AddQuestModal'
import { questApi } from '@/lib/quest-api'
import { useQuests } from '@/hooks/useQuests'
import { QuestCard } from '../quest/QuestCard'
import { QuestPagination } from '../quest/QuestPagination'
import { DeleteConfirmationModal } from './DeleteConfirmationModal'

interface MyQuestListProps {
  userId: string | undefined
  token: string | undefined
}

export const MyQuestList = ({ userId, token }: MyQuestListProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deleteQuestId, setDeleteQuestId] = useState<string | null>(null)

  const {
    quests,
    allQuests,
    loading,
    filter,
    setFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    totalQuests,
    refetch,
  } = useQuests({ userId, token, mode: 'my' })

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

  const handleDeleteClick = (questId: string) => {
    setDeleteQuestId(questId)
  }

  const handleConfirmDelete = async () => {
    if (!token || !deleteQuestId) return

    try {
      await questApi.deleteQuest(token, deleteQuestId)
      setDeleteQuestId(null)

      const data = await refetch()

      if (quests.length === 1 && currentPage > 1) {
        setCurrentPage(1)
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete quest')
    }
  }

  return (
    <div>
      <div className="max-w-6xl mx-auto sticky top-16 z-49 bg-gray-50 py-4 px-4">
        <QuestHeader
          title="My Quests"
          onAddClick={() => setIsModalOpen(true)}
        />
      </div>
      <div className="max-w-6xl mx-auto px-4 py-8">
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
                <QuestCard
                  key={quest._id}
                  quest={quest}
                  showDelete={true}
                  onDelete={() => handleDeleteClick(quest._id)}
                />
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
      </div>
      <AddQuestModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateQuest}
      />
      <DeleteConfirmationModal
        open={!!deleteQuestId}
        onClose={() => setDeleteQuestId(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
