'use client'

import { Provider } from 'react-redux'
import { store } from '@/store'
import { useEffect } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { loadUser } from '@/store/slices/authSlice'

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(loadUser())
  }, [dispatch])

  return <>{children}</>
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer>{children}</AuthInitializer>
    </Provider>
  )
}
