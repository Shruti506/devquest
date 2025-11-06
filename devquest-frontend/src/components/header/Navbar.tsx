'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LogoutButton from '@/components/header/LogoutButton'
import { useEffect, useState } from 'react'
import { UserIcon } from 'lucide-react'
import { appEvents } from '@/lib/events'
import { useUser } from '@/context/UserProvider'

interface NavbarProps {
  userEmail: string | null
  token: string | null
}

export default function Navbar({ userEmail, token }: NavbarProps) {
  const pathname = usePathname()
  const [activeItem, setActiveItem] = useState<string | null>(pathname)

  const { userData, refetch } = useUser()

  useEffect(() => {
    const handleQuestCompleted = (event: Event) => {
      refetch()
    }

    appEvents.addEventListener('questCompleted', handleQuestCompleted)

    return () => {
      appEvents.removeEventListener('questCompleted', handleQuestCompleted)
    }
  }, [refetch])

  const showNavbar = !!userEmail
  if (!showNavbar) return null

  const navItems = [
    { name: 'Quest', href: '/quest' },
    { name: 'My Quest', href: '/my-quest' },
    { name: 'My Activity', href: '/my-activity' },
  ]

  const handleNavClick = (href: string) => {
    setActiveItem(href)
  }

  const isActive = (href: string) => pathname === href

  const isLeaderboardActive = pathname?.startsWith('/leaderboard')

  return (
    <div className="bg-gray-50 p-4 sticky top-0 z-50">
      <div className="max-w-8xl mx-auto flex justify-between items-center">
        <Link
          href="/dashboard"
          className={`text-2xl font-bold text-gray-900 px-3 py-1 rounded-md ${
            isActive('/dashboard') && 'bg-blue-100 text-blue-700'
          }`}
          onClick={() => handleNavClick('/dashboard')}
        >
          Dashboard
        </Link>

        <nav className="flex space-x-6 items-center">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => handleNavClick(item.href)}
              className={`font-medium px-3 py-1 rounded-md transition-colors duration-200 text-gray-700 hover:text-gray-900
                ${isActive(item.href) && 'bg-blue-100 text-blue-700'}`}
            >
              {item.name}
            </Link>
          ))}

          {token && (
            <Link
              href="/leaderboard"
              onClick={() => handleNavClick('/leaderboard')}
              className={`font-medium px-3 py-1 rounded-md transition-colors duration-200 text-gray-700 hover:text-gray-900 hover:bg-gray-100
                ${isLeaderboardActive ? 'bg-blue-100 text-blue-700' : ''}`}
            >
              Leaderboard
            </Link>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          {userData && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-gray-100">
              <UserIcon className="w-5 h-5 text-gray-700" />
              <span className="text-sm font-medium text-gray-800">
                {userData.user?.name || 'User'}
              </span>
              <span className="text-sm font-semibold text-blue-600">
                {userData.user?.xp?.toLocaleString() || 0} XP
              </span>
            </div>
          )}
          <LogoutButton />
        </div>
      </div>
    </div>
  )
}
