'use client';

import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';

export default function LogoutButton() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
    >
      Logout
    </button>
  );
}