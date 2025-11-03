'use client';

import { useAppSelector } from '@/store/hooks';
import LogoutButton from '@/components/auth/LogoutButton';

export default function Navbar() {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-indigo-600">DevQuest</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {user && (
              <div className="text-gray-700">
                Welcome, <span className="font-semibold">{user.name}</span>
              </div>
            )}
            <LogoutButton />
          </div>
        </div>
      </div>
    </nav>
  );
}