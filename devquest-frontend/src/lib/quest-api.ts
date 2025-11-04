// src/lib/quest-api.ts
import {
  Quest,
  CreateQuestDTO,
  Difficulty,
  QuestApiResponse,
  QuestDetailApiResponse,
} from '@/types/quest'

const API_BASE_URL = 'http://localhost:4000/api'

export const questApi = {
  async getQuests(token: string): Promise<QuestApiResponse> {
    const response = await fetch(`${API_BASE_URL}/quests`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch quests')
    }

    return response.json()
  },

  async getQuestById(token: string, questId: string): Promise<Quest> {
    const response = await fetch(`${API_BASE_URL}/quests/${questId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Quest not found')
      }
      throw new Error('Failed to fetch quest details')
    }

    // return response.json()
    const data: QuestDetailApiResponse = await response.json()
    return data.quest
  },

  async createQuest(token: string, quest: CreateQuestDTO): Promise<Quest> {
    const response = await fetch(`${API_BASE_URL}/quests`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(quest),
    })

    if (!response.ok) {
      throw new Error('Failed to create quest')
    }

    return response.json()
  },

  async completeQuest(token: string, questId: string): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/progress/complete/${questId}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      },
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(errorText || 'Failed to mark quest as complete')
    }
  },
}

// Helper function to calculate reward points
export const getRewardPoints = (difficulty: Difficulty): number => {
  const rewardMap = {
    Easy: 8,
    Medium: 16,
    Hard: 24,
  }
  return rewardMap[difficulty]
}
