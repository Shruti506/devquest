// src/components/quest/QuestFilters.tsx
'use client'

import { FilterType } from '@/types/quest'

interface QuestFiltersProps {
  activeFilter: FilterType
  onFilterChange: (filter: FilterType) => void
  counts: {
    all: number
    solved: number
    unsolved: number
  }
}

export const QuestFilters = ({
  activeFilter,
  onFilterChange,
  counts,
}: QuestFiltersProps) => {
  const filters: { label: FilterType; count: number }[] = [
    { label: 'All', count: counts.all },
    { label: 'Solved', count: counts.solved },
    { label: 'Unsolved', count: counts.unsolved },
  ]

  return (
    <div className="flex gap-2 border-b border-gray-200 mb-6">
      {filters.map((filter) => (
        <button
          key={filter.label}
          onClick={() => onFilterChange(filter.label)}
          className={`px-4 py-2 text-sm font-medium transition-colors relative ${
            activeFilter === filter.label
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {filter.label}
          <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded-full">
            {filter.count}
          </span>
        </button>
      ))}
    </div>
  )
}
