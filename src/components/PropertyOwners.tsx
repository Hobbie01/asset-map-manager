'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { PropertyOwner } from '@/lib/types';
import {
  getPropertyOwners,
  createPropertyOwner,
  updatePropertyOwner,
  deletePropertyOwner,
  createActivityLog,
  getPropertiesByOwnerId
} from '@/lib/storage';
import { Plus, Edit, Trash2, Eye, Building, Users, Home, Phone, Mail, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const ownerSchema = z.object({
  name: z.string().min(1, 'กรุณากรอกชื่อ'),
  address: z.string().min(1, 'กรุณากรอกที่อยู่'),
  phone: z.string().min(1, 'กรุณากรอกเบอร์โทรศัพท์'),
  email: z.string().email('รูปแบบอีเมลไม่ถูกต้อง').min(1, 'กรุณากรอกอีเมล')
});

type OwnerFormData = z.infer<typeof ownerSchema>;

export const PropertyOwners = () => {
  const { authState } = useAuth();
  const [owners, setOwners] = useState<PropertyOwner[]>([]);
  const [selectedOwner, setSelectedOwner] = useState<PropertyOwner | null>(null);
  const [editingOwner, setEditingOwner] = useState<PropertyOwner | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<OwnerFormData>({
    resolver: zodResolver(ownerSchema)
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    setValue: setValueEdit,
    formState: { errors: errorsEdit }
  } = useForm<OwnerFormData>({
    resolver: zodResolver(ownerSchema)
  });

  useEffect(() => {
    loadOwners();
  }, []);

  const loadOwners = () => {
    setOwners(getPropertyOwners());
  };

  const onCreateSubmit = (data: OwnerFormData) => {
    try {
      const newOwner = createPropertyOwner(data);

      // Log activity
      createActivityLog({
        action: 'CREATE',
        entityType: 'OWNER',
        entityId: newOwner.id,
        entityName: newOwner.name,
        adminUser: authState.username || 'admin'
      });

      loadOwners();
      reset();
      setIsCreateDialogOpen(false);
      toast.success('เพิ่มข้อมูลเจ้าของสินทรัพย์เรียบร้อยแล้ว');
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการเพิ่มข้อมูล');
    }
  };

  const onEditSubmit = (data: OwnerFormData) => {
    if (!editingOwner) return;

    try {
      const updatedOwner = updatePropertyOwner(editingOwner.id, data);
      if (updatedOwner) {
        // Log activity
        createActivityLog({
          action: 'UPDATE',
          entityType: 'OWNER',
          entityId: updatedOwner.id,
          entityName: updatedOwner.name,
          adminUser: authState.username || 'admin'
        });

        loadOwners();
        setIsEditDialogOpen(false);
        setEditingOwner(null);
        toast.success('แก้ไขข้อมูลเรียบร้อยแล้ว');
      }
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการแก้ไขข้อมูล');
    }
  };

  const handleEdit = (owner: PropertyOwner) => {
    setEditingOwner(owner);
    setValueEdit('name', owner.name);
    setValueEdit('address', owner.address);
    setValueEdit('phone', owner.phone);
    setValueEdit('email', owner.email);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (owner: PropertyOwner) => {
    if (confirm(`คุณต้องการลบข้อมูลของ ${owner.name} ใช่หรือไม่?`)) {
      try {
        const success = deletePropertyOwner(owner.id);
        if (success) {
          // Log activity
          createActivityLog({
            action: 'DELETE',
            entityType: 'OWNER',
            entityId: owner.id,
            entityName: owner.name,
            adminUser: authState.username || 'admin'
          });

          loadOwners();
          toast.success('ลบข้อมูลเรียบร้อยแล้ว');
        }
      } catch (error) {
        toast.error('เกิดข้อผิดพลาดในการลบข้อมูล');
      }
    }
  };

  const handleView = (owner: PropertyOwner) => {
    setSelectedOwner(owner);
    setIsViewDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">เจ้าของสินทรัพย์</h2>
          <p className="text-gray-600">จัดการข้อมูลเจ้าของสินทรัพย์</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={16} className="mr-2" />
              เพิ่มเจ้าของสินทรัพย์
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>เพิ่มเจ้าของสินทรัพย์ใหม่</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onCreateSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">ชื่อ-นามสกุล</Label>
                <Input
                  id="name"
                  {...register('name')}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">ที่อยู่</Label>
                <Input
                  id="address"
                  {...register('address')}
                  className={errors.address ? 'border-red-500' : ''}
                />
                {errors.address && (
                  <p className="text-sm text-red-500">{errors.address.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                <Input
                  id="phone"
                  {...register('phone')}
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">อีเมล</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    reset();
                  }}
                >
                  ยกเลิก
                </Button>
                <Button type="submit">บันทึก</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Owners Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ชื่อ-นามสกุล</TableHead>
                <TableHead>เบอร์โทรศัพท์</TableHead>
                <TableHead>อีเมล</TableHead>
                <TableHead>วันที่เพิ่ม</TableHead>
                <TableHead>สินทรัพย์</TableHead>
                <TableHead className="text-center">การดำเนินการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {owners.length > 0 ? (
                owners.map((owner) => {
                  const propertyCount = getPropertiesByOwnerId(owner.id).length;
                  return (
                    <TableRow key={owner.id}>
                      <TableCell className="font-medium">{owner.name}</TableCell>
                      <TableCell>{owner.phone}</TableCell>
                      <TableCell>{owner.email}</TableCell>
                      <TableCell>
                        {format(new Date(owner.createdAt), 'dd MMM yyyy', { locale: th })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Building size={16} className="mr-1" />
                          {propertyCount} รายการ
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleView(owner)}
                          >
                            <Eye size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(owner)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(owner)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    ยังไม่มีข้อมูลเจ้าของสินทรัพย์
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>แก้ไขข้อมูลเจ้าของสินทรัพย์</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitEdit(onEditSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">ชื่อ-นามสกุล</Label>
              <Input
                id="edit-name"
                {...registerEdit('name')}
                className={errorsEdit.name ? 'border-red-500' : ''}
              />
              {errorsEdit.name && (
                <p className="text-sm text-red-500">{errorsEdit.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-address">ที่อยู่</Label>
              <Input
                id="edit-address"
                {...registerEdit('address')}
                className={errorsEdit.address ? 'border-red-500' : ''}
              />
              {errorsEdit.address && (
                <p className="text-sm text-red-500">{errorsEdit.address.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-phone">เบอร์โทรศัพท์</Label>
              <Input
                id="edit-phone"
                {...registerEdit('phone')}
                className={errorsEdit.phone ? 'border-red-500' : ''}
              />
              {errorsEdit.phone && (
                <p className="text-sm text-red-500">{errorsEdit.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">อีเมล</Label>
              <Input
                id="edit-email"
                type="email"
                {...registerEdit('email')}
                className={errorsEdit.email ? 'border-red-500' : ''}
              />
              {errorsEdit.email && (
                <p className="text-sm text-red-500">{errorsEdit.email.message}</p>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setEditingOwner(null);
                  resetEdit();
                }}
              >
                ยกเลิก
              </Button>
              <Button type="submit">บันทึกการแก้ไข</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>ข้อมูลเจ้าของสินทรัพย์</DialogTitle>
          </DialogHeader>
          {selectedOwner && (
            <div className="bg-gray-50 rounded-xl p-4 sm:p-6 flex flex-col space-y-3">
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                <span className="bg-blue-100 text-blue-600 rounded-full p-2"><Users size={20} /></span>
                <div>
                  <div className="text-xs text-gray-500">ชื่อ-นามสกุล</div>
                  <div className="font-semibold text-gray-900">{selectedOwner.name}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                <span className="bg-green-100 text-green-600 rounded-full p-2"><Home size={20} /></span>
                <div>
                  <div className="text-xs text-gray-500">ที่อยู่</div>
                  <div className="font-semibold text-gray-900">{selectedOwner.address}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                <span className="bg-yellow-100 text-yellow-600 rounded-full p-2"><Phone size={20} /></span>
                <div>
                  <div className="text-xs text-gray-500">เบอร์โทรศัพท์</div>
                  <div className="font-semibold text-gray-900">{selectedOwner.phone}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                <span className="bg-purple-100 text-purple-600 rounded-full p-2"><Mail size={20} /></span>
                <div>
                  <div className="text-xs text-gray-500">อีเมล</div>
                  <div className="font-semibold text-gray-900">{selectedOwner.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                <span className="bg-gray-200 text-gray-700 rounded-full p-2"><Calendar size={20} /></span>
                <div>
                  <div className="text-xs text-gray-500">วันที่เพิ่มข้อมูล</div>
                  <div className="text-gray-900">{format(new Date(selectedOwner.createdAt), 'dd MMMM yyyy เวลา HH:mm', { locale: th })}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                <span className="bg-gray-200 text-gray-700 rounded-full p-2"><Edit size={20} /></span>
                <div>
                  <div className="text-xs text-gray-500">วันที่แก้ไขล่าสุด</div>
                  <div className="text-gray-900">{format(new Date(selectedOwner.updatedAt), 'dd MMMM yyyy เวลา HH:mm', { locale: th })}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                <span className="bg-indigo-100 text-indigo-600 rounded-full p-2"><Building size={20} /></span>
                <div>
                  <div className="text-xs text-gray-500">จำนวนสินทรัพย์</div>
                  <div className="text-gray-900 font-semibold">{getPropertiesByOwnerId(selectedOwner.id).length} รายการ</div>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end mt-4">
            <Button onClick={() => setIsViewDialogOpen(false)}>
              ปิด
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
