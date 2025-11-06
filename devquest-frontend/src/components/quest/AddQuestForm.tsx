'use client'

import { useState } from 'react'
import { TextField, MenuItem } from '@mui/material'
import { Difficulty } from '@/types/quest'
import { getRewardPoints } from '@/lib/quest-api'
import toast from 'react-hot-toast'

interface AddQuestFormProps {
  onSubmit: (data: {
    title: string
    description: string
    difficulty: Difficulty
    xpReward: number
  }) => Promise<void>
  onCancel: () => void
}

export const AddQuestForm = ({ onSubmit, onCancel }: AddQuestFormProps) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy')
  const [loading, setLoading] = useState(false)

  const xpReward = getRewardPoints(difficulty)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !description.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      setLoading(true)
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        difficulty,
        xpReward,
      })

      toast.success('Quest created successfully!')

      // Reset form
      setTitle('')
      setDescription('')
      setDifficulty('Easy')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create quest') 
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          required
          disabled={loading}
          placeholder="Enter quest title"
        />
      </div>
      <div>
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          required
          multiline
          rows={4}
          disabled={loading}
          placeholder="Enter quest description"
        />
      </div>
      <div>
        <TextField
          label="Difficulty"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as Difficulty)}
          select
          fullWidth
          disabled={loading}
        >
          <MenuItem value="Easy">Easy</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="Hard">Hard</MenuItem>
        </TextField>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">
            Reward Points:
          </span>
          <span className="text-2xl font-bold text-blue-600">
            {xpReward} pts
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Auto-calculated based on difficulty
        </p>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Quest'}
        </button>
      </div>
    </form>
  )
}
