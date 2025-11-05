// src/types/activity.ts
export interface ActivityLog {
  _id: string
  user: string
  activityType:
    | 'quest_created'
    | 'quest_completed'
    | 'badge_earned'
    | 'level_up'
    | 'quest_updated'
    | 'quest_deleted'
  description?: string
  metadata: {
    questId?: string
    badgeId?: string
    badgeName?: string
    level?: number
    xp?: number
  }
  createdAt: string
  __v: number
}

export interface ActivityApiResponse {
  items: ActivityLog[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ActivityFilters {
  page?: number
  limit?: number
  activityType?:
    | 'quest_completed'
    | 'quest_created'
    | 'badge_earned'
    | 'level_up'
    | 'quest_updated'
    | 'quest_deleted'
    | 'all'
  startDate?: string
  endDate?: string
}
