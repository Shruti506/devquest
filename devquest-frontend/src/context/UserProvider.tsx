'use client'

import {
  createContext,
  useContext,
  ReactNode,
} from 'react'
import { useMyRank } from '@/hooks/useMyRank'

interface UserContextType {
  userData: ReturnType<typeof useMyRank>['userData'] | null
  refetch: () => void
  token: string | null
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({
  children,
  token,
}: {
  children: ReactNode
  token: string | null
}) => {
  const { userData, refetch } = useMyRank(token)

  return (
    <UserContext.Provider value={{ userData, refetch, token }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
