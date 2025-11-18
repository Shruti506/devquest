// src/hooks/useLogout.ts
'use client'

import { useRouter } from 'next/navigation'
import { clearClientTokens } from '@/lib/auth'
import { logoutAction } from '@/actions/auth.actions'

export function useLogout() {
  const router = useRouter()

  const logout = async () => {
    try {
      clearClientTokens()
      await logoutAction()
    } catch (error) {
      console.error('Logout error:', error)
      clearClientTokens()
      router.push('/login')
    }
  }

  return { logout }
}
