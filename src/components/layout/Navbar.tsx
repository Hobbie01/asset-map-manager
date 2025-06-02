"use client";

import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { useTheme } from 'next-themes'
import { FiSun, FiMoon, FiUser, FiLogOut } from 'react-icons/fi'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Asset Map Manager
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 text-gray-500 rounded-lg hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              {theme === 'dark' ? (
                <FiSun className="w-5 h-5" />
              ) : (
                <FiMoon className="w-5 h-5" />
              )}
            </button>

            <Menu as="div" className="relative">
              <Menu.Button className="p-2 text-gray-500 rounded-lg hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                <FiUser className="w-5 h-5" />
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 w-48 mt-2 origin-top-right bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleSignOut}
                          className={`${
                            active
                              ? 'bg-gray-100 dark:bg-gray-700'
                              : ''
                          } flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
                        >
                          <FiLogOut className="w-4 h-4 mr-2" />
                          ออกจากระบบ
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </nav>
  )
} 