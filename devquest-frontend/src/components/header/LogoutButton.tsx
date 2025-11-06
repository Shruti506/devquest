// src/components/LogoutButton.tsx
'use client'

import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { logoutAction } from '@/actions/auth.actions'
import { LogoutOutlined } from '@mui/icons-material'

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition()

  const handleLogout = () => {

    startTransition(async () => {
      await logoutAction()
    })
  }

  return (
    <Button
      onClick={handleLogout}
      disabled={isPending}
      variant="outline"
      className="flex items-center gap-2"
    >
      <LogoutOutlined fontSize="small" />
      {isPending ? 'Logging out...' : 'Logout'}
    </Button>
  )
}
