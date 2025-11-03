'use client';

import { useAppSelector } from '@/store/hooks';

export default function DashboardContent() {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Dashboard
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Welcome back, {user?.name}! 🎉
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Total Projects</h3>
            <p className="text-3xl font-bold">12</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Completed</h3>
            <p className="text-3xl font-bold">8</p>
          </div>
          <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">In Progress</h3>
            <p className="text-3xl font-bold">4</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">User Information</h2>
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="text-gray-600 w-32">Name:</span>
              <span className="font-semibold text-gray-900">{user?.name}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 w-32">Email:</span>
              <span className="font-semibold text-gray-900">{user?.email}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 w-32">User ID:</span>
              <span className="font-semibold text-gray-900">{user?.id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}