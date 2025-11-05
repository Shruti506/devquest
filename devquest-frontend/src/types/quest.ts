// src/types/quest.ts

export type Difficulty = 'Easy' | 'Medium' | 'Hard'
export type QuestStatus = 'Solved' | 'Unsolved'
export type FilterType = 'All' | 'Solved' | 'Unsolved'

export interface Quest {
  _id: string
  title: string
  description: string
  difficulty: Difficulty
  xpReward: number
  completedBy: string[]
  createdBy?: {
    name: string
    userId: string
  }
  createdAt?: string
  updatedAt?: string
  status?: QuestStatus
}

export interface QuestWithStatus extends Quest {
  status: QuestStatus
}

export interface CreateQuestDTO {
  title: string
  description: string
  difficulty: Difficulty
}

export interface QuestApiResponse {
  items: Quest[]
  // total: number
  // page?: number
  // limit?: number
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface QuestDetailApiResponse {
  quest: Quest
}

export interface QuestFilters {
  status?: QuestStatus | 'All'
  difficulty?: Difficulty | 'All'
  search?: string
}
