import { ReactNode } from 'react'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'react-hot-toast'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
        <Toaster position="top-right" />
      </div>
    </ThemeProvider>
  )
} 