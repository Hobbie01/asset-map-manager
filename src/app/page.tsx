import { FiFileText, FiUsers, FiMap, FiActivity } from 'react-icons/fi'
import Link from 'next/link'

const stats = [
  {
    name: 'ทรัพย์สินทั้งหมด',
    value: '0',
    icon: FiFileText,
    href: '/assets',
  },
  {
    name: 'เจ้าของทั้งหมด',
    value: '0',
    icon: FiUsers,
    href: '/owners',
  },
  {
    name: 'กิจกรรมล่าสุด',
    value: '0',
    icon: FiActivity,
    href: '/activity-logs',
  },
  {
    name: 'ทรัพย์สินบนแผนที่',
    value: '0',
    icon: FiMap,
    href: '/map',
  },
]

export default function Home() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          ยินดีต้อนรับ
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          ระบบจัดการทรัพย์สินแบบครบวงจร
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="relative overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6 shadow hover:shadow-md transition-shadow"
          >
            <dt>
              <div className="absolute rounded-md bg-blue-500 p-3">
                <stat.icon
                  className="h-6 w-6 text-white"
                  aria-hidden="true"
                />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                {stat.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {stat.value}
              </p>
            </dd>
          </Link>
        ))}
      </div>

      <div className="rounded-lg bg-white dark:bg-gray-800 shadow">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            กิจกรรมล่าสุด
          </h3>
          <div className="mt-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ยังไม่มีกิจกรรม
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
