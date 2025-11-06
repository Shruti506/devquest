'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { X, ArrowUpDown } from 'lucide-react'
import { leaderboardApi } from '@/lib/leaderboard-api'
import { LeaderboardUser } from '@/types/leaderboard'

interface LeaderboardModalProps {
  token: string
}

export default function LeaderboardModal({ token }: LeaderboardModalProps) {
  const router = useRouter()
  const [items, setItems] = useState<LeaderboardUser[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
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
    setItems([])
    setPage(1)
    setHasMore(true)
    loadLeaderboard(1, sortOrder, true)
  }, [sortOrder, loadLeaderboard])

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

  const handleClose = () => {
    router.back()
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="border-b border-gray-200 p-6 bg-gray-50 rounded-t-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Leaderboard</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
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

        <div className="overflow-y-auto p-6 flex-1">
          {items.length === 0 && !loading ? (
            <div className="text-center py-12 text-gray-500">
              No leaderboard data available
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={item._id || item.userId || `${index}`}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <span className="text-lg font-semibold text-gray-400 w-10">
                      #{item.rank}
                    </span>
                    <span className="text-base font-medium text-gray-900 truncate">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-base font-bold text-blue-600 ml-2">
                    {item.xp.toLocaleString()} XP
                  </span>
                </div>
              ))}

              {loading && (
                <div className="text-center py-8">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                </div>
              )}

              <div ref={observerTarget} className="h-4" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
