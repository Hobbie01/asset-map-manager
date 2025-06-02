import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'ไม่มีสิทธิ์เข้าถึง - Asset Map Manager',
  description: 'คุณไม่มีสิทธิ์เข้าถึงหน้านี้',
}

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            ไม่มีสิทธิ์เข้าถึง
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            คุณไม่มีสิทธิ์เข้าถึงหน้านี้ กรุณาติดต่อผู้ดูแลระบบ
          </p>
        </div>
        <div>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            กลับหน้าหลัก
          </Link>
        </div>
      </div>
    </div>
  )
} 