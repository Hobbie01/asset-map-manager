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
import type { Property, PropertyOwner, PropertyFile } from '@/lib/types';
import {
  getProperties,
  getPropertyOwners,
  createProperty,
  updateProperty,
  deleteProperty,
  createActivityLog,
  getPropertyOwnerById
} from '@/lib/storage';
import { Plus, Edit, Trash2, Eye, MapPin, FileText, Users, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { FileUpload } from './FileUpload';

const propertySchema = z.object({
  ownerId: z.string().min(1, 'กรุณาเลือกเจ้าของสินทรัพย์'),
  title: z.string().min(1, 'กรุณากรอกชื่อสินทรัพย์'),
  description: z.string().min(1, 'กรุณากรอกรายละเอียด'),
  address: z.string().min(1, 'กรุณากรอกที่อยู่'),
  mapLink: z.string().url('รูปแบบลิงค์ไม่ถูกต้อง').min(1, 'กรุณากรอกลิงค์แมพ')
});

type PropertyFormData = z.infer<typeof propertySchema>;

export const Properties = () => {
  const { authState } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [owners, setOwners] = useState<PropertyOwner[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [propertyFiles, setPropertyFiles] = useState<PropertyFile[]>([]);
  const [editPropertyFiles, setEditPropertyFiles] = useState<PropertyFile[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema)
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    setValue: setValueEdit,
    formState: { errors: errorsEdit }
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema)
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setProperties(getProperties());
    setOwners(getPropertyOwners());
  };

  const onCreateSubmit = (data: PropertyFormData) => {
    try {
      const newProperty = createProperty({
        ...data,
        files: propertyFiles
      });

      // Log activity
      createActivityLog({
        action: 'CREATE',
        entityType: 'PROPERTY',
        entityId: newProperty.id,
        entityName: newProperty.title,
        adminUser: authState.username || 'admin'
      });

      loadData();
      reset();
      setPropertyFiles([]);
      setIsCreateDialogOpen(false);
      toast.success('เพิ่มสินทรัพย์เรียบร้อยแล้ว');
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการเพิ่มสินทรัพย์');
    }
  };

  const onEditSubmit = (data: PropertyFormData) => {
    if (!editingProperty) return;

    try {
      const updatedProperty = updateProperty(editingProperty.id, data);
      if (updatedProperty) {
        // Log activity
        createActivityLog({
          action: 'UPDATE',
          entityType: 'PROPERTY',
          entityId: updatedProperty.id,
          entityName: updatedProperty.title,
          adminUser: authState.username || 'admin'
        });

        loadData();
        setIsEditDialogOpen(false);
        setEditingProperty(null);
        toast.success('แก้ไขสินทรัพย์เรียบร้อยแล้ว');
      }
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการแก้ไขสินทรัพย์');
    }
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setValueEdit('ownerId', property.ownerId);
    setValueEdit('title', property.title);
    setValueEdit('description', property.description);
    setValueEdit('address', property.address);
    setValueEdit('mapLink', property.mapLink);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (property: Property) => {
    if (confirm(`คุณต้องการลบสินทรัพย์ ${property.title} ใช่หรือไม่?`)) {
      try {
        const success = deleteProperty(property.id);
        if (success) {
          // Log activity
          createActivityLog({
            action: 'DELETE',
            entityType: 'PROPERTY',
            entityId: property.id,
            entityName: property.title,
            adminUser: authState.username || 'admin',
            changes: [
              {
                field: 'title',
                oldValue: property.title
              },
              {
                field: 'description',
                oldValue: property.description
              },
              {
                field: 'address',
                oldValue: property.address
              },
              {
                field: 'ownerId',
                oldValue: getOwnerName(property.ownerId)
              }
            ]
          });

          // Refresh data immediately
          setProperties(getProperties());
          toast.success('ลบสินทรัพย์เรียบร้อยแล้ว');
        }
      } catch (error) {
        toast.error('เกิดข้อผิดพลาดในการลบสินทรัพย์');
      }
    }
  };

  const handleView = (property: Property) => {
    setSelectedProperty(property);
    setShowMap(false);
    setIsViewDialogOpen(true);
  };

  const getOwnerName = (ownerId: string) => {
    const owner = getPropertyOwnerById(ownerId);
    return owner ? owner.name : 'ไม่พบข้อมูล';
  };

  // Helper function to check if the map link is embeddable
  const getEmbedMapLink = (mapLink: string) => {
    if (mapLink.includes('embed')) {
      return mapLink;
    }
    // Try to convert Google Maps link to embed format
    if (mapLink.includes('google.com/maps')) {
      const match = mapLink.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (match) {
        const [, lat, lng] = match;
        return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1000!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zTGF0aXR1ZGUgJiBMb25naXR1ZGU!5e0!3m2!1sen!2s!4v1000000000000!5m2!1sen!2s`;
      }
    }
    return mapLink;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">สินทรัพย์</h2>
          <p className="text-gray-600">จัดการข้อมูลสินทรัพย์และไฟล์เอกสาร</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={16} className="mr-2" />
              เพิ่มสินทรัพย์
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>เพิ่มสินทรัพย์ใหม่</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onCreateSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ownerId">เจ้าของสินทรัพย์</Label>
                <select
                  id="ownerId"
                  {...register('ownerId')}
                  className={`w-full border rounded-md px-3 py-2 ${errors.ownerId ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">เลือกเจ้าของสินทรัพย์</option>
                  {owners.map((owner) => (
                    <option key={owner.id} value={owner.id}>
                      {owner.name}
                    </option>
                  ))}
                </select>
                {errors.ownerId && (
                  <p className="text-sm text-red-500">{errors.ownerId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">ชื่อสินทรัพย์</Label>
                <Input
                  id="title"
                  {...register('title')}
                  className={`${errors.title ? 'border-red-500' : ''} w-full max-w-md`}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">รายละเอียด</Label>
                <Input
                  id="description"
                  {...register('description')}
                  className={`${errors.description ? 'border-red-500' : ''} w-full max-w-md`}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">ที่อยู่สินทรัพย์</Label>
                <Input
                  id="address"
                  {...register('address')}
                  className={`${errors.address ? 'border-red-500' : ''} w-full max-w-md`}
                />
                {errors.address && (
                  <p className="text-sm text-red-500">{errors.address.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="mapLink">ลิงค์แมพ (Google Maps)</Label>
                <Input
                  id="mapLink"
                  placeholder="https://www.google.com/maps/..."
                  {...register('mapLink')}
                  className={`${errors.mapLink ? 'border-red-500' : ''} w-full max-w-md`}
                />
                {errors.mapLink && (
                  <p className="text-sm text-red-500">{errors.mapLink.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>ไฟล์เอกสาร</Label>
                <div className="w-full max-w-md">
                  <FileUpload
                    onFilesChange={setPropertyFiles}
                    existingFiles={propertyFiles}
                    maxFiles={5}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 sticky bottom-0 bg-white pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    reset();
                    setPropertyFiles([]);
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

      {/* Properties Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ชื่อสินทรัพย์</TableHead>
                <TableHead>เจ้าของ</TableHead>
                <TableHead>ที่อยู่</TableHead>
                <TableHead>วันที่เพิ่ม</TableHead>
                <TableHead className="text-center">การดำเนินการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.length > 0 ? (
                properties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell className="font-medium">{property.title}</TableCell>
                    <TableCell>{getOwnerName(property.ownerId)}</TableCell>
                    <TableCell className="max-w-xs truncate">{property.address}</TableCell>
                    <TableCell>
                      {format(new Date(property.createdAt), 'dd MMM yyyy', { locale: th })}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleView(property)}
                        >
                          <Eye size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(property)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(property)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    ยังไม่มีข้อมูลสินทรัพย์
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>แก้ไขข้อมูลสินทรัพย์</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitEdit(onEditSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-ownerId">เจ้าของสินทรัพย์</Label>
              <select
                id="edit-ownerId"
                {...registerEdit('ownerId')}
                className={`w-full border rounded-md px-3 py-2 ${errorsEdit.ownerId ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">เลือกเจ้าของสินทรัพย์</option>
                {owners.map((owner) => (
                  <option key={owner.id} value={owner.id}>
                    {owner.name}
                  </option>
                ))}
              </select>
              {errorsEdit.ownerId && (
                <p className="text-sm text-red-500">{errorsEdit.ownerId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-title">ชื่อสินทรัพย์</Label>
              <Input
                id="edit-title"
                {...registerEdit('title')}
                className={errorsEdit.title ? 'border-red-500' : ''}
              />
              {errorsEdit.title && (
                <p className="text-sm text-red-500">{errorsEdit.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">รายละเอียด</Label>
              <Input
                id="edit-description"
                {...registerEdit('description')}
                className={errorsEdit.description ? 'border-red-500' : ''}
              />
              {errorsEdit.description && (
                <p className="text-sm text-red-500">{errorsEdit.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-address">ที่อยู่สินทรัพย์</Label>
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
              <Label htmlFor="edit-mapLink">ลิงค์แมพ (Google Maps)</Label>
              <Input
                id="edit-mapLink"
                {...registerEdit('mapLink')}
                className={`${errorsEdit.mapLink ? 'border-red-500' : ''} w-full max-w-md`}
              />
              {errorsEdit.mapLink && (
                <p className="text-sm text-red-500">{errorsEdit.mapLink.message}</p>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setEditingProperty(null);
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
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>รายละเอียดสินทรัพย์</span>
            </DialogTitle>
          </DialogHeader>
          {selectedProperty && (
            <div className="flex flex-col space-y-3 bg-gray-50 rounded-xl p-4 sm:p-6">
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                <span className="bg-blue-100 text-blue-600 rounded-full p-2"><FileText size={20} /></span>
                <div>
                  <div className="text-xs text-gray-500">ชื่อสินทรัพย์</div>
                  <div className="font-semibold text-gray-900">{selectedProperty.title}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                <span className="bg-green-100 text-green-600 rounded-full p-2"><Users size={20} /></span>
                <div>
                  <div className="text-xs text-gray-500">เจ้าของ</div>
                  <div className="font-semibold text-gray-900">{getOwnerName(selectedProperty.ownerId)}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm min-w-0">
                <span className="bg-yellow-100 text-yellow-600 rounded-full p-2"><FileText size={20} /></span>
                <div className="min-w-0">
                  <div className="text-xs text-gray-500">รายละเอียด</div>
                  <div className="font-semibold text-gray-900 line-clamp-4 max-w-[350px] break-words">{selectedProperty.description}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm min-w-0">
                <span className="bg-purple-100 text-purple-600 rounded-full p-2"><MapPin size={20} /></span>
                <div className="min-w-0">
                  <div className="text-xs text-gray-500">ที่อยู่</div>
                  <div className="font-semibold text-gray-900 max-w-[350px] break-words">{selectedProperty.address}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                <span className="bg-gray-200 text-gray-700 rounded-full p-2"><Calendar size={20} /></span>
                <div>
                  <div className="text-xs text-gray-500">วันที่เพิ่มข้อมูล</div>
                  <div className="text-gray-900">{format(new Date(selectedProperty.createdAt), 'dd MMMM yyyy เวลา HH:mm', { locale: th })}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                <span className="bg-gray-200 text-gray-700 rounded-full p-2"><Edit size={20} /></span>
                <div>
                  <div className="text-xs text-gray-500">วันที่แก้ไขล่าสุด</div>
                  <div className="text-gray-900">{format(new Date(selectedProperty.updatedAt), 'dd MMMM yyyy เวลา HH:mm', { locale: th })}</div>
                </div>
              </div>
              {/* Files Section */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-600">ไฟล์เอกสาร</Label>
                {selectedProperty.files.length > 0 ? (
                  <div className="space-y-2">
                    {selectedProperty.files.map((file) => (
                      <div key={file.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center min-w-0">
                          <FileText size={16} className="mr-2 text-blue-600 shrink-0" />
                          <div className="min-w-0">
                            <p className="font-medium truncate">{file.name}</p>
                            <p className="text-sm text-gray-500">
                              {(file.size / 1024).toFixed(2)} KB • {format(new Date(file.uploadedAt), 'dd MMM yyyy', { locale: th })}
                            </p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="shrink-0">
                          ดาวน์โหลด
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-md">
                    <FileText size={48} className="mx-auto mb-2 text-gray-300" />
                    <p>ยังไม่มีไฟล์เอกสาร</p>
                  </div>
                )}
              </div>
              {/* Map - always show if mapLink exists */}
              {selectedProperty.mapLink && (
                <div className="w-full max-w-md mx-auto">
                  <Label className="text-sm font-medium text-gray-600">แผนที่ตำแหน่ง</Label>
                  <div className="h-48 sm:h-64 md:h-72 border rounded-lg overflow-hidden w-full">
                    <iframe
                      src={getEmbedMapLink(selectedProperty.mapLink)}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="แผนที่สินทรัพย์"
                    />
                  </div>
                  <div className="mt-2">
                    <input
                      type="text"
                      readOnly
                      value={selectedProperty.mapLink}
                      className="w-full text-xs text-gray-500 bg-gray-100 rounded px-2 py-1 truncate"
                      style={{ maxWidth: '100%' }}
                    />
                  </div>
                  <div className="flex justify-end mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(selectedProperty.mapLink, '_blank')}
                      className="shrink-0"
                    >
                      เปิดในหน้าใหม่
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="flex justify-end">
            <Button onClick={() => setIsViewDialogOpen(false)}>
              ปิด
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
