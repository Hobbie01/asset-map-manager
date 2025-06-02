"use client";

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  FiHome,
  FiMap,
  FiFileText,
  FiUsers,
  FiActivity,
  FiArchive,
} from 'react-icons/fi'

const navigation = [
  { name: 'แดชบอร์ด', href: '/', icon: FiHome },
  { name: 'ทรัพย์สิน', href: '/assets', icon: FiFileText },
  { name: 'แผนที่', href: '/map', icon: FiMap },
  { name: 'เจ้าของ', href: '/owners', icon: FiUsers },
  { name: 'บันทึกกิจกรรม', href: '/activity-logs', icon: FiActivity },
  { name: 'ถังขยะ', href: '/trash', icon: FiArchive },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 min-h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="flex flex-col h-full">
        <div className="flex-1 px-3 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                  isActive
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                }`}
              >
                <item.icon
                  className={`w-5 h-5 mr-3 ${
                    isActive
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-400 dark:text-gray-500'
                  }`}
                />
                {item.name}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
} 