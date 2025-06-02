import { Metadata } from 'next'
import LoginForm from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'เข้าสู่ระบบ - Asset Map Manager',
  description: 'เข้าสู่ระบบเพื่อจัดการทรัพย์สิน',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            เข้าสู่ระบบ
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Asset Map Manager
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
} 