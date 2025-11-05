// src/components/activity/ActivityFilters.tsx
'use client'

import { ActivityFilters as Filters } from '@/types/activity'
import {
  Filter,
  X,
  CheckCircle,
  Plus,
  Edit,
  Award,
  TrendingUp,
  Trash2,
} from 'lucide-react'

interface ActivityFiltersProps {
  filters: Filters
  onFilterChange: (filters: Filters) => void
}

const ActivityFilters = ({ filters, onFilterChange }: ActivityFiltersProps) => {
  const handleActivityTypeChange = (activityType: string) => {
    onFilterChange({
      ...filters,
      activityType: activityType as Filters['activityType'],
      page: 1,
    })
  }

  const handleReset = () => {
    onFilterChange({
      page: 1,
      limit: filters.limit || 10,
      activityType: 'all',
    })
  }

  const hasActiveFilters = filters.activityType !== 'all'

  const filterButtons = [
    {
      value: 'all',
      label: 'All',
      color: 'bg-gray-600',
      icon: <Filter className="w-4 h-4" />,
    },
    {
      value: 'quest_completed',
      label: 'Completed',
      color: 'bg-green-600',
      icon: <CheckCircle className="w-4 h-4" />,
    },
    {
      value: 'quest_created',
      label: 'Created',
      color: 'bg-blue-600',
      icon: <Plus className="w-4 h-4" />,
    },
    {
      value: 'quest_updated',
      label: 'Updated',
      color: 'bg-orange-600',
      icon: <Edit className="w-4 h-4" />,
    },
    {
      value: 'quest_deleted',
      label: 'Deleted',
      color: 'bg-red-600',
      icon: <Trash2 className="w-4 h-4" />,
    },
    {
      value: 'badge_earned',
      label: 'Badges',
      color: 'bg-yellow-600',
      icon: <Award className="w-4 h-4" />,
    },
    {
      value: 'level_up',
      label: 'Level Up',
      color: 'bg-purple-600',
      icon: <TrendingUp className="w-4 h-4" />,
    },
  ]

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <X className="w-4 h-4" />
            Reset
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Activity Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Activity Type
          </label>
          <div className="flex flex-wrap gap-2">
            {filterButtons.map((filter) => (
              <button
                key={filter.value}
                onClick={() => handleActivityTypeChange(filter.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filters.activityType === filter.value ||
                  (!filters.activityType && filter.value === 'all')
                    ? `${filter.color} text-white shadow-md`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.icon}
                <span>{filter.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActivityFilters
