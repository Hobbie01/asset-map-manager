"use client";

import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8 text-center">
            <div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
                เกิดข้อผิดพลาด
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {this.state.error?.message || 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ'}
              </p>
            </div>
            <div>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                ลองใหม่อีกครั้ง
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
} 