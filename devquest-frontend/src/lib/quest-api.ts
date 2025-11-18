// src/lib/quest-api.ts
import {
  Quest,
  CreateQuestDTO,
  Difficulty,
  QuestApiResponse,
  QuestDetailApiResponse,
} from '@/types/quest'
import { apiClient } from './api-client'

export const questApi = {
  async getQuests(
    token: string,
    params?: {
      page?: number
      limit?: number
      difficulty?: string
      category?: string
      status?: string
      sort?: 'newest' | 'xp' | '-xp'
    },
  ): Promise<QuestApiResponse> {
    const query = new URLSearchParams()

    if (params?.page) query.append('page', String(params.page))
    if (params?.limit) query.append('limit', String(params.limit))
    if (params?.difficulty) query.append('difficulty', params.difficulty)
    if (params?.category) query.append('category', params.category)
    if (params?.status) query.append('status', params.status)
    if (params?.sort) query.append('sort', params.sort)

    return apiClient.get<QuestApiResponse>(`/quests?${query.toString()}`, {
      token,
    })
  },

  async getMyQuests(
    token: string,
    params?: {
      page?: number
      limit?: number
      difficulty?: string
      category?: string
      status?: string
      sort?: 'newest' | 'xp' | '-xp'
    },
  ): Promise<QuestApiResponse> {
    const query = new URLSearchParams()

    if (params?.page) query.append('page', String(params.page))
    if (params?.limit) query.append('limit', String(params.limit))
    if (params?.difficulty) query.append('difficulty', params.difficulty)
    if (params?.category) query.append('category', params.category)
    if (params?.status) query.append('status', params.status)
    if (params?.sort) query.append('sort', params.sort)

    return apiClient.get<QuestApiResponse>(
      `/quests/my-quests?${query.toString()}`,
      {
        token,
      },
    )
  },

  async getQuestById(token: string, questId: string): Promise<Quest> {
    const data = await apiClient.get<QuestDetailApiResponse>(
      `/quests/${questId}`,
      { token },
    )
    return data.quest
  },

  async createQuest(quest: CreateQuestDTO, token: string): Promise<Quest> {
    return apiClient.post<Quest>('/quests', quest, { token })
  },

  async completeQuest(questId: string, token: string): Promise<void> {
    await apiClient.post<void>(`/progress/complete/${questId}`, { token })
  },

  async deleteQuest(questId: string, token: string): Promise<void> {
    await apiClient.delete<void>(`/quests/${questId}`, { token })
  },
}

export const getRewardPoints = (difficulty: Difficulty): number => {
  const rewardMap = {
    Easy: 8,
    Medium: 16,
    Hard: 24,
  }
  return rewardMap[difficulty]
}