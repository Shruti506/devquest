'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ArrowUpDown } from 'lucide-react'
import { leaderboardApi } from '@/lib/leaderboard-api'
import { LeaderboardUser } from '@/types/leaderboard'

interface LeaderboardPopoverProps {
  token: string
  isActive?: boolean
}

export default function LeaderboardPopover({
  token,
  isActive = false,
}: LeaderboardPopoverProps) {
  const [items, setItems] = useState<LeaderboardUser[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [open, setOpen] = useState(false)
  const observerTarget = useRef<HTMLDivElement>(null)

  const loadingRef = useRef(false)

  const loadLeaderboard = useCallback(
    async (pageNum: number, sort: 'asc' | 'desc', reset = false) => {
      if (loadingRef.current) return

      loadingRef.current = true
      setLoading(true)

      try {
        const response = await leaderboardApi.getLeaderboard(token, {
          scope: 'global',
          page: pageNum,
          limit: 10,
          sort,
        })

        if (reset) {
          setItems(response.items)
        } else {
          setItems((prev) => [...prev, ...response.items])
        }

        setHasMore(pageNum < response.meta.totalPages)
      } catch (error) {
        console.error('Failed to load leaderboard:', error)
      } finally {
        setLoading(false)
        loadingRef.current = false
      }
    },
    [token],
  )

  useEffect(() => {
    if (open) {
      setItems([])
      setPage(1)
      setHasMore(true)
      loadLeaderboard(1, sortOrder, true)
    }
  }, [open, sortOrder, loadLeaderboard])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          const nextPage = page + 1
          setPage(nextPage)
          loadLeaderboard(nextPage, sortOrder, false)
        }
      },
      { threshold: 1.0 },
    )

    const currentTarget = observerTarget.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [hasMore, loading, page, sortOrder, loadLeaderboard])

  const handleSortToggle = () => {
    const newSort = sortOrder === 'desc' ? 'asc' : 'desc'
    setSortOrder(newSort)
    setItems([])
    setPage(1)
    setHasMore(true)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={`font-medium px-3 py-1 rounded-md transition-colors duration-200 text-gray-700 hover:text-gray-900 hover:bg-gray-100
            ${
              isActive ? 'bg-blue-100 text-blue-700' : ''
            } data-[state=open]:bg-blue-100`}
        >
          Leaderboard
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[500px] p-0 bg-white shadow-lg border border-gray-200"
        align="end"
        sideOffset={8}
      >
        {/* Header */}
        <div className="border-b border-gray-200 p-4 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Leaderboard
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Username</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">XP</span>
              <button
                onClick={handleSortToggle}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
                aria-label="Toggle sort order"
              >
                <ArrowUpDown className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[500px] overflow-y-auto p-4">
          {items.length === 0 && !loading ? (
            <div className="text-center py-8 text-gray-500">
              No leaderboard data available
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((item, index) => (
                <div
                  key={item._id || item.userId || `${index}`}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-sm font-semibold text-gray-400 w-8">
                      #{item.rank}
                    </span>
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-blue-600 ml-2">
                    {item.xp.toLocaleString()} XP
                  </span>
                </div>
              ))}

              {loading && (
                <div className="text-center py-4">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-blue-600 border-r-transparent"></div>
                </div>
              )}

              <div ref={observerTarget} className="h-4" />
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
