'use client'

import { useRouter } from 'next/navigation'
import {
  ArrowRightOnRectangleIcon,
  UserIcon,
} from '@heroicons/react/24/outline'

const UserPanel = () => {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      })
      router.push('/login')
    }
    catch (error) {
      console.error('Failed to logout', error)
    }
  }

  return (
    <div className="flex items-center justify-between p-4 border-t border-gray-200">
      <div className="flex items-center">
        <UserIcon className="h-6 w-6 text-gray-500" />
        <span className="ml-2 text-sm font-medium text-gray-700">admin</span>
      </div>
      <button
        onClick={handleLogout}
        className="p-1 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <ArrowRightOnRectangleIcon className="h-6 w-6 text-gray-500" />
      </button>
    </div>
  )
}

export default UserPanel
