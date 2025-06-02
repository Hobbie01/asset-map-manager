// Instructions: Update Layout component to handle navigation between pages

'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Home,
  Users,
  Building,
  FileText,
  LogOut,
  Menu,
  X
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage?: string;
  onNavigate?: (page: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPage = 'dashboard', onNavigate }) => {
  const { authState, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { id: 'dashboard', name: 'แดชบอร์ด', icon: Home },
    { id: 'owners', name: 'เจ้าของสินทรัพย์', icon: Users },
    { id: 'properties', name: 'สินทรัพย์', icon: Building },
    { id: 'logs', name: 'บันทึกกิจกรรม', icon: FileText },
  ];

  const handleNavigation = (pageId: string) => {
    setSidebarOpen(false);
    if (onNavigate) {
      onNavigate(pageId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`hidden lg:flex flex-col h-full w-64 fixed left-0 top-0 z-50 bg-white shadow-lg`}>
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <h1 className="text-xl font-semibold text-gray-800">ระบบจัดการสินทรัพย์</h1>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </Button>
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <nav className="p-4 space-y-2 overflow-y-auto flex-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`w-full flex items-center px-3 py-2 text-left rounded-md transition-colors ${
                    currentPage === item.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} className="mr-3" />
                  {item.name}
                </button>
              );
            })}
          </nav>
          <div className="p-4 pt-0">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {authState.username}
                    </p>
                    <p className="text-xs text-gray-500">ผู้ดูแลระบบ</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    title="ออกจากระบบ"
                  >
                    <LogOut size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:hidden flex flex-col`}>
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <h1 className="text-xl font-semibold text-gray-800">ระบบจัดการสินทรัพย์</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </Button>
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <nav className="p-4 space-y-2 overflow-y-auto flex-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`w-full flex items-center px-3 py-2 text-left rounded-md transition-colors ${
                    currentPage === item.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} className="mr-3" />
                  {item.name}
                </button>
              );
            })}
          </nav>
          <div className="p-4 pt-0">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {authState.username}
                    </p>
                    <p className="text-xs text-gray-500">ผู้ดูแลระบบ</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    title="ออกจากระบบ"
                  >
                    <LogOut size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {/* Main content */}
      <div className="flex-1 ml-0 lg:ml-64">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b h-16 flex items-center px-4 lg:px-8">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden mr-4"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </Button>
          <h2 className="text-lg font-semibold text-gray-900">
            {navigation.find(item => item.id === currentPage)?.name || 'แดชบอร์ด'}
          </h2>
        </div>
        {/* Page content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
