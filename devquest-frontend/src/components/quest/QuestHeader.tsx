'use client'

import { Plus } from 'lucide-react'

interface QuestHeaderProps {
  title?: string
  subtitle?: string
  onAddClick?: () => void
  addButtonLabel?: string
}

export const QuestHeader = ({
  title = 'Quests',
  subtitle = 'Complete quests to earn rewards and level up',
  onAddClick,
  addButtonLabel = 'Add Quest',
}: QuestHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
      </div>
      {onAddClick && (
        <button
          onClick={onAddClick}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          {addButtonLabel}
        </button>
      )}
    </div>
  )
}
