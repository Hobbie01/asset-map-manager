'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { ActivityLog } from '@/lib/types';
import { getActivityLogs } from '@/lib/storage';
import { FileText, Search, Calendar, User, Activity, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export const ActivityLogs = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<ActivityLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState('');
  const [selectedEntityType, setSelectedEntityType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    loadLogs();
  }, []);

  useEffect(() => {
    let filtered = logs;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.adminUser.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by action
    if (selectedAction) {
      filtered = filtered.filter(log => log.action === selectedAction);
    }

    // Filter by entity type
    if (selectedEntityType) {
      filtered = filtered.filter(log => log.entityType === selectedEntityType);
    }

    setFilteredLogs(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [logs, searchTerm, selectedAction, selectedEntityType]);

  const loadLogs = () => {
    const allLogs = getActivityLogs();
    setLogs(allLogs);
  };

  const filterLogs = () => {
    let filtered = logs;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.adminUser.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by action
    if (selectedAction) {
      filtered = filtered.filter(log => log.action === selectedAction);
    }

    // Filter by entity type
    if (selectedEntityType) {
      filtered = filtered.filter(log => log.entityType === selectedEntityType);
    }

    setFilteredLogs(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const getActionText = (action: string) => {
    switch (action) {
      case 'CREATE': return 'เพิ่ม';
      case 'UPDATE': return 'แก้ไข';
      case 'DELETE': return 'ลบ';
      default: return action;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE': return 'bg-green-100 text-green-800';
      case 'UPDATE': return 'bg-blue-100 text-blue-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEntityTypeText = (entityType: string) => {
    switch (entityType) {
      case 'OWNER': return 'เจ้าของสินทรัพย์';
      case 'PROPERTY': return 'สินทรัพย์';
      default: return entityType;
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedAction('');
    setSelectedEntityType('');
  };

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLogs = filteredLogs.slice(startIndex, endIndex);

  // Statistics
  const stats = {
    total: logs.length,
    today: logs.filter(log =>
      new Date(log.timestamp).toDateString() === new Date().toDateString()
    ).length,
    thisWeek: logs.filter(log => {
      const logDate = new Date(log.timestamp);
      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      return logDate >= weekAgo;
    }).length,
    creates: logs.filter(log => log.action === 'CREATE').length,
    updates: logs.filter(log => log.action === 'UPDATE').length,
    deletes: logs.filter(log => log.action === 'DELETE').length
  };

  const getFieldName = (field: string) => {
    const fieldNames: Record<string, string> = {
      name: 'ชื่อ',
      address: 'ที่อยู่',
      phone: 'เบอร์โทรศัพท์',
      email: 'อีเมล',
      title: 'ชื่อสินทรัพย์',
      description: 'รายละเอียด',
      ownerId: 'เจ้าของสินทรัพย์',
      mapLink: 'ลิงค์แมพ'
    };
    return fieldNames[field] || field;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">บันทึกกิจกรรม</h2>
        <p className="text-gray-600">ติดตามการเปลี่ยนแปลงและกิจกรรมทั้งหมดในระบบ</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">ทั้งหมด</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.today}</div>
            <div className="text-sm text-gray-600">วันนี้</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.thisWeek}</div>
            <div className="text-sm text-gray-600">สัปดาห์นี้</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.creates}</div>
            <div className="text-sm text-gray-600">เพิ่ม</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.updates}</div>
            <div className="text-sm text-gray-600">แก้ไข</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.deletes}</div>
            <div className="text-sm text-gray-600">ลบ</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search size={20} className="mr-2" />
            ตัวกรอง
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">ค้นหา</Label>
              <Input
                id="search"
                placeholder="ค้นหาชื่อหรือผู้ใช้..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="action">การดำเนินการ</Label>
              <select
                id="action"
                value={selectedAction}
                onChange={(e) => setSelectedAction(e.target.value)}
                className="w-full border rounded-md px-3 py-2 border-gray-300"
              >
                <option value="">ทั้งหมด</option>
                <option value="CREATE">เพิ่ม</option>
                <option value="UPDATE">แก้ไข</option>
                <option value="DELETE">ลบ</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="entityType">ประเภท</Label>
              <select
                id="entityType"
                value={selectedEntityType}
                onChange={(e) => setSelectedEntityType(e.target.value)}
                className="w-full border rounded-md px-3 py-2 border-gray-300"
              >
                <option value="">ทั้งหมด</option>
                <option value="OWNER">เจ้าของสินทรัพย์</option>
                <option value="PROPERTY">สินทรัพย์</option>
              </select>
            </div>
            <div className="space-y-2 flex items-end">
              <Button
                variant="outline"
                onClick={clearFilters}
                className="w-full"
              >
                ล้างตัวกรอง
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText size={20} className="mr-2" />
              บันทึกกิจกรรม
            </div>
            <div className="text-sm text-gray-500">
              แสดง {startIndex + 1}-{Math.min(endIndex, filteredLogs.length)} จาก {filteredLogs.length} รายการ
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>วันที่/เวลา</TableHead>
                <TableHead>การดำเนินการ</TableHead>
                <TableHead>ประเภท</TableHead>
                <TableHead>ชื่อ</TableHead>
                <TableHead>ผู้ดำเนินการ</TableHead>
                <TableHead className="text-center">รายละเอียด</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentLogs.length > 0 ? (
                currentLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {format(new Date(log.timestamp), 'dd MMM yyyy', { locale: th })}
                        </div>
                        <div className="text-sm text-gray-500">
                          {format(new Date(log.timestamp), 'HH:mm:ss')}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                        {getActionText(log.action)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {log.entityType === 'OWNER' ? (
                          <User size={16} className="mr-1 text-blue-600" />
                        ) : (
                          <Activity size={16} className="mr-1 text-green-600" />
                        )}
                        {getEntityTypeText(log.entityType)}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{log.entityName}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <User size={16} className="mr-1 text-gray-400" />
                        {log.adminUser}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedLog(log);
                          setIsViewDialogOpen(true);
                        }}
                      >
                        <Eye size={16} className="mr-1" />
                        ดูรายละเอียด
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    {filteredLogs.length === 0 && logs.length > 0
                      ? 'ไม่พบรายการที่ตรงกับการค้นหา'
                      : 'ยังไม่มีบันทึกกิจกรรม'
                    }
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Changes Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>รายละเอียดการเปลี่ยนแปลง</DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm text-gray-500">การดำเนินการ</div>
                  <div className="font-medium">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(selectedLog.action)}`}>
                      {getActionText(selectedLog.action)}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">ประเภท</div>
                  <div className="font-medium">{getEntityTypeText(selectedLog.entityType)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">ชื่อ</div>
                  <div className="font-medium">{selectedLog.entityName}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">ผู้ดำเนินการ</div>
                  <div className="font-medium">{selectedLog.adminUser}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">วันที่</div>
                  <div className="font-medium">
                    {format(new Date(selectedLog.timestamp), 'dd MMMM yyyy', { locale: th })}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">เวลา</div>
                  <div className="font-medium">
                    {format(new Date(selectedLog.timestamp), 'HH:mm:ss')}
                  </div>
                </div>
              </div>

              {selectedLog.changes && selectedLog.changes.length > 0 ? (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700">รายละเอียดการเปลี่ยนแปลง</div>
                  <div className="space-y-2">
                    {selectedLog.changes.map((change, index) => (
                      <div key={index} className="p-3 bg-white border rounded-lg">
                        <div className="font-medium text-gray-900 mb-1">
                          {getFieldName(change.field)}
                        </div>
                        {selectedLog.action === 'UPDATE' && (
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="text-gray-500">ค่าเดิม</div>
                              <div className="text-red-600 line-through">{change.oldValue || '-'}</div>
                            </div>
                            <div>
                              <div className="text-gray-500">ค่าใหม่</div>
                              <div className="text-green-600">{change.newValue || '-'}</div>
                            </div>
                          </div>
                        )}
                        {selectedLog.action === 'DELETE' && (
                          <div className="text-sm">
                            <div className="text-gray-500">ค่าที่ถูกลบ</div>
                            <div className="text-red-600">{change.oldValue || '-'}</div>
                          </div>
                        )}
                        {selectedLog.action === 'CREATE' && (
                          <div className="text-sm">
                            <div className="text-gray-500">ค่าที่เพิ่ม</div>
                            <div className="text-green-600">{change.newValue || '-'}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  {selectedLog.action === 'CREATE' && 'เพิ่มข้อมูลใหม่'}
                  {selectedLog.action === 'DELETE' && 'ลบข้อมูลออกจากระบบ'}
                  {selectedLog.action === 'UPDATE' && (
                    <div className="space-y-2">
                      <div>บันทึกการแก้ไข</div>
                      <div className="text-sm">ไม่มีการเปลี่ยนแปลงข้อมูล</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  ก่อนหน้า
                </Button>
                <span className="text-sm text-gray-600">
                  หน้า {currentPage} จาก {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  ถัดไป
                </Button>
              </div>
              <div className="text-sm text-gray-500">
                รวมทั้งหมด {filteredLogs.length} รายการ
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
