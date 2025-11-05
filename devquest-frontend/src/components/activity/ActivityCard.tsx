// src/components/activity/ActivityCard.tsx
'use client'

import { ActivityLog } from '@/types/activity'
import {
  CheckCircle,
  Plus,
  Edit,
  Trophy,
  Calendar,
  Award,
  TrendingUp,
  Trash2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ActivityCardProps {
  activity: ActivityLog
}

const ActivityCard = ({ activity }: ActivityCardProps) => {
  const getActionInfo = () => {
    switch (activity.activityType) {
      case 'quest_completed':
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          label: 'Quest Completed',
          color: 'bg-green-100 text-green-700 border-green-200',
        }
      case 'quest_created':
        return {
          icon: <Plus className="w-5 h-5" />,
          label: 'Quest Created',
          color: 'bg-blue-100 text-blue-700 border-blue-200',
        }
      case 'quest_updated':
        return {
          icon: <Edit className="w-5 h-5" />,
          label: 'Quest Updated',
          color: 'bg-orange-100 text-orange-700 border-orange-200',
        }
      case 'quest_deleted':
        return {
          icon: <Trash2 className="w-5 h-5" />,
          label: 'Quest Deleted',
          color: 'bg-red-100 text-red-700 border-red-200',
        }
      case 'badge_earned':
        return {
          icon: <Award className="w-5 h-5" />,
          label: 'Badge Earned',
          color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        }
      case 'level_up':
        return {
          icon: <TrendingUp className="w-5 h-5" />,
          label: 'Level Up',
          color: 'bg-purple-100 text-purple-700 border-purple-200',
        }
      default:
        return {
          icon: <Calendar className="w-5 h-5" />,
          label: 'Activity',
          color: 'bg-gray-100 text-gray-700 border-gray-200',
        }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    })
  }

  const getActivityTitle = () => {
    // Remove prefixes from description
    const cleanDescription = activity.description?.replace(
      /^(Completed quest:|Created quest:|Updated quest:|Deleted quest:|Earned badge:|Leveled up to level)\s*/i,
      '',
    )

    switch (activity.activityType) {
      case 'badge_earned':
        return (
          activity.metadata?.badgeName || cleanDescription || 'Badge Earned'
        )
      case 'level_up':
        return (
          `Reached Level ${activity.metadata?.level || ''}` ||
          cleanDescription ||
          'Level Up'
        )
      default:
        return cleanDescription || 'Quest Activity'
    }
  }

  const actionInfo = getActionInfo()
  const activityTitle = getActivityTitle()
  const xpEarned = activity.metadata?.xp || 0

  // Show reward badge for activities that grant XP or special rewards
  const showReward = () => {
    if (activity.activityType === 'quest_completed' && xpEarned > 0) {
      return (
        <div className="flex items-center gap-1.5 bg-purple-50 border border-purple-200 text-purple-700 px-3 py-1.5 rounded-full shrink-0">
          <Trophy className="w-4 h-4" />
          <span className="font-semibold text-sm">+{xpEarned} XP</span>
        </div>
      )
    }

    if (activity.activityType === 'badge_earned') {
      return (
        <div className="flex items-center gap-1.5 bg-yellow-50 border border-yellow-200 text-yellow-700 px-3 py-1.5 rounded-full shrink-0">
          <Award className="w-4 h-4" />
          <span className="font-semibold text-sm">Badge</span>
        </div>
      )
    }

    if (activity.activityType === 'level_up') {
      return (
        <div className="flex items-center gap-1.5 bg-purple-50 border border-purple-200 text-purple-700 px-3 py-1.5 rounded-full shrink-0">
          <TrendingUp className="w-4 h-4" />
          <span className="font-semibold text-sm">
            Level {activity.metadata?.level}
          </span>
        </div>
      )
    }

    return null
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          {/* Action Icon */}
          <div
            className={cn('p-2 rounded-full border shrink-0', actionInfo.color)}
          >
            {actionInfo.icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span
                className={cn(
                  'px-2.5 py-1 rounded text-xs font-medium',
                  actionInfo.color,
                )}
              >
                {actionInfo.label}
              </span>
            </div>

            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
              {activityTitle}
            </h3>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(activity.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Reward/Info Badge */}
        {showReward()}
      </div>
    </div>
  )
}

export default ActivityCard
