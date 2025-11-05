export interface LeaderboardUser {
  _id?: string
  userId?: string
  name: string
  email: string
  xp: number
  level: number
  earnedXp?: number
  badgesCount: number
  completedQuestsCount: number
  rank: number
}

export interface LeaderboardMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  scope: string
}

export interface LeaderboardResponse {
  items: LeaderboardUser[]
  meta: LeaderboardMeta
}

export interface NearbyUsers {
  above: LeaderboardUser[]
  below: LeaderboardUser[]
}

export interface UserRankResponse {
  user: LeaderboardUser
  rank: number
  nearby: NearbyUsers
}
