'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { PropertyOwner, Property, ActivityLog } from '@/lib/types';
import {
  getPropertyOwners,
  getProperties,
  getActivityLogs,
  initializeSampleData
} from '@/lib/storage';
import { Users, Building, FileText, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

export const Dashboard = () => {
  const [owners, setOwners] = useState<PropertyOwner[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [recentLogs, setRecentLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    // Initialize sample data on first load
    initializeSampleData();

    // Load data
    setOwners(getPropertyOwners());
    setProperties(getProperties());
    setRecentLogs(getActivityLogs().slice(0, 5)); // Get 5 most recent logs
  }, []);

  const stats = [
    {
      title: 'เจ้าของสินทรัพย์',
      value: owners.length,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'สินทรัพย์ทั้งหมด',
      value: properties.length,
      icon: Building,
      color: 'bg-green-500'
    },
    {
      title: 'กิจกรรมวันนี้',
      value: recentLogs.filter(log =>
        new Date(log.timestamp).toDateString() === new Date().toDateString()
      ).length,
      icon: FileText,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-full`}>
                    <Icon size={24} className="text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus size={20} className="mr-2" />
            การดำเนินการด่วน
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button className="h-auto p-4 justify-start" variant="outline">
              <Users size={20} className="mr-3" />
              <div className="text-left">
                <div className="font-medium">เพิ่มเจ้าของสินทรัพย์</div>
                <div className="text-sm text-gray-500">เพิ่มข้อมูลเจ้าของใหม่</div>
              </div>
            </Button>
            <Button className="h-auto p-4 justify-start" variant="outline">
              <Building size={20} className="mr-3" />
              <div className="text-left">
                <div className="font-medium">เพิ่มสินทรัพย์</div>
                <div className="text-sm text-gray-500">เพิ่มสินทรัพย์ใหม่</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText size={20} className="mr-2" />
            กิจกรรมล่าสุด
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentLogs.length > 0 ? (
            <div className="space-y-3">
              {recentLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      log.action === 'CREATE' ? 'bg-green-500' :
                      log.action === 'UPDATE' ? 'bg-blue-500' : 'bg-red-500'
                    }`} />
                    <div>
                      <p className="font-medium text-gray-900">
                        {log.action === 'CREATE' ? 'เพิ่ม' :
                         log.action === 'UPDATE' ? 'แก้ไข' : 'ลบ'}
                        {log.entityType === 'OWNER' ? 'เจ้าของสินทรัพย์' : 'สินทรัพย์'}
                      </p>
                      <p className="text-sm text-gray-600">{log.entityName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {format(new Date(log.timestamp), 'dd MMM yyyy', { locale: th })}
                    </p>
                    <p className="text-xs text-gray-400">
                      {format(new Date(log.timestamp), 'HH:mm')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">ยังไม่มีกิจกรรม</p>
          )}
        </CardContent>
      </Card>

      {/* Recent Owners */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users size={20} className="mr-2" />
            เจ้าของสินทรัพย์ล่าสุด
          </CardTitle>
        </CardHeader>
        <CardContent>
          {owners.length > 0 ? (
            <div className="space-y-3">
              {owners.slice(0, 5).map((owner) => (
                <div key={owner.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div>
                    <p className="font-medium text-gray-900">{owner.name}</p>
                    <p className="text-sm text-gray-600">{owner.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {format(new Date(owner.createdAt), 'dd MMM yyyy', { locale: th })}
                    </p>
                    <p className="text-xs text-gray-400">
                      สินทรัพย์: {properties.filter(p => p.ownerId === owner.id).length} รายการ
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">ยังไม่มีข้อมูลเจ้าของสินทรัพย์</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
