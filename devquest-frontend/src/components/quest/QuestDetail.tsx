'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, Chip, CircularProgress } from '@mui/material'
import {
  ArrowLeft,
  Calendar,
  Trophy,
  Target,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import { Quest, QuestStatus } from '@/types/quest'
import { questApi } from '@/lib/quest-api'
import { appEvents } from '@/lib/events'
import toast from 'react-hot-toast'
import { useUser } from '@/context/UserProvider'

interface QuestDetailProps {
  questId: string
  token: string | undefined
  userId: string | undefined
}

export const QuestDetail = ({ questId, token, userId }: QuestDetailProps) => {
  const router = useRouter()
  const [quest, setQuest] = useState<Quest | null>(null)
  const [loading, setLoading] = useState(true)

  const { refetch } = useUser()

  const questStatus: QuestStatus = useMemo(() => {
    if (!quest || !userId) return 'Unsolved'
    return quest.completedBy?.includes(userId) ? 'Solved' : 'Unsolved'
  }, [quest, userId])

  useEffect(() => {
    const fetchQuestDetail = async () => {
      if (!token) {
        toast.error('Authentication required')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const data = await questApi.getQuestById(token, questId)
        setQuest(data)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to load quest')
      } finally {
        setLoading(false)
      }
    }

    fetchQuestDetail()
  }, [questId, token])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'success'
      case 'Medium':
        return 'warning'
      case 'Hard':
        return 'error'
      default:
        return 'default'
    }
  }

  const getStatusColor = (status: QuestStatus) => {
    return status === 'Solved' ? 'success' : 'default'
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <CircularProgress />
      </div>
    )
  }

  if (!quest) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Quests
        </button>
        {toast.error('Quest not found')}
      </div>
    )
  }

  const handleMarkComplete = async () => {
    if (!token) return

    try {
      setLoading(true)
      await questApi.completeQuest(token, questId)
      setQuest((prev) =>
        prev
          ? { ...prev, completedBy: [...(prev.completedBy || []), userId!] }
          : prev,
      )
      await refetch()

      appEvents.dispatchEvent(
        new CustomEvent('questCompleted', {
          detail: { questId, userId },
        }),
      )

      toast.success('Quest marked as complete!')
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to complete quest',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Quests
      </button>

      <Card className="shadow-lg mb-6">
        <div className="p-6 bg-linear-to-r from-blue-50 to-indigo-50 rounded-t-lg">
          <div className="flex flex-wrap gap-3 mb-4">
            <Chip
              label={quest.difficulty}
              color={getDifficultyColor(quest.difficulty)}
              size="medium"
            />
            <Chip
              label={questStatus}
              color={getStatusColor(questStatus)}
              size="medium"
              variant="outlined"
              icon={
                questStatus === 'Solved' ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )
              }
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{quest.title}</h1>
        </div>

        <CardContent className="p-6">
          {/* Quest Description */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Quest Description
            </h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {quest.description}
            </p>
          </div>

          {/* Quest Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-linear-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-yellow-600" />
                <span className="text-sm font-medium text-gray-600">
                  Reward
                </span>
              </div>
              <p className="text-2xl font-bold text-yellow-700">
                {quest.xpReward} XP
              </p>
            </div>

            <div className="p-4 bg-linear-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">
                  Created
                </span>
              </div>
              <p className="text-lg font-semibold text-blue-700">
                {quest.createdAt
                  ? new Date(quest.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'N/A'}
              </p>
            </div>

            <div className="p-4 bg-linear-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-600">
                  Updated
                </span>
              </div>
              <p className="text-lg font-semibold text-purple-700">
                {quest.updatedAt
                  ? new Date(quest.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'N/A'}
              </p>
            </div>
          </div>

          {quest.createdBy?._id !== userId && (
            <div className="flex gap-3 pt-6 border-t border-gray-200">
              {questStatus === 'Unsolved' ? (
                <button
                  onClick={handleMarkComplete}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Mark as Complete
                </button>
              ) : (
                <button className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg cursor-not-allowed font-medium">
                  Already Completed
                </button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quest Metadata Card */}
      <Card className="shadow-md">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quest Information
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Quest ID</span>
              <span className="font-mono text-sm text-gray-900">
                {quest._id}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Difficulty Level</span>
              <span className="font-semibold text-gray-900">
                {quest.difficulty}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Status</span>
              <span className="font-semibold text-gray-900">{questStatus}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Created By</span>
              <span className="text-sm text-gray-900">
                {quest.createdBy?.name ?? 'Unknown'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Completed By</span>
              <span className="font-mono text-xs text-gray-900">
                {quest.completedBy?.length
                  ? `${quest.completedBy.length} user${
                      quest.completedBy.length > 1 ? 's' : ''
                    }`
                  : 'No completions yet'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
