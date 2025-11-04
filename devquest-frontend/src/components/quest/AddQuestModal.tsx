// src/components/quest/AddQuestModal.tsx
'use client'

import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import { AddQuestForm } from './AddQuestForm'
import { Difficulty } from '@/types/quest'

interface AddQuestModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: {
    title: string
    description: string
    difficulty: Difficulty
    xpReward: number
  }) => Promise<void>
}

export const AddQuestModal = ({
  open,
  onClose,
  onSubmit,
}: AddQuestModalProps) => {
  const handleSubmit = async (data: any) => {
    await onSubmit(data)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="text-xl font-bold">Add New Quest</DialogTitle>
      <DialogContent>
        <div className="pt-4">
          <AddQuestForm onSubmit={handleSubmit} onCancel={onClose} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
