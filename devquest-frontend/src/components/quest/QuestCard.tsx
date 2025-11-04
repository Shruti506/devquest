// src/components/quest/QuestCard.tsx
'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, Chip } from '@mui/material'
import { Calendar, Trophy } from 'lucide-react'
import { Quest } from '@/types/quest'

interface QuestCardProps {
  quest: Quest
}

export const QuestCard = ({ quest }: QuestCardProps) => {
  const router = useRouter()

  const handleCardClick = () => {
    router.push(`/quest/${quest._id}`)
  }

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

  const getStatusColor = (status: string) => {
    return status === 'Solved' ? 'success' : 'default'
  }

  return (
    <Card
      onClick={handleCardClick}
      className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <Chip
            label={quest.difficulty}
            color={getDifficultyColor(quest.difficulty)}
            size="small"
          />
          <Chip
            // label={quest.status}
            // color={getStatusColor(quest.status)}
            label={quest.status ?? 'Unsolved'}
            color={getStatusColor(quest.status ?? 'Unsolved')}
            size="small"
            variant="outlined"
          />
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {quest.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1">
          {quest.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>
              {quest.createdAt
                ? new Date(quest.createdAt).toLocaleDateString()
                : 'Unknown date'}
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm font-medium text-blue-600">
            <Trophy className="w-4 h-4" />
            <span>{quest.xpReward} XP</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
