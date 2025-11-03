import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-6">
          Welcome to DevQuest
        </h1>
        <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
          Your journey to becoming a better developer starts here. Sign in or create an account to get started.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold text-lg hover:bg-gray-100 transition transform hover:scale-105"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-8 py-4 bg-purple-600 text-white rounded-xl font-semibold text-lg hover:bg-purple-700 transition transform hover:scale-105 border-2 border-white"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}