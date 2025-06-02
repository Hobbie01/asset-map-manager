'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { PropertyFile } from '@/lib/types';
import { Upload, FileText, X } from 'lucide-react';
import { toast } from 'sonner';

interface FileUploadProps {
  onFilesChange: (files: PropertyFile[]) => void;
  existingFiles?: PropertyFile[];
  maxFiles?: number;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFilesChange,
  existingFiles = [],
  maxFiles = 5
}) => {
  const [files, setFiles] = useState<PropertyFile[]>(existingFiles);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;

    const newFiles: PropertyFile[] = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];

      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`ไฟล์ ${file.name} มีขนาดใหญ่เกินไป (สูงสุด 10MB)`);
        continue;
      }

      // Check total files limit
      if (files.length + newFiles.length >= maxFiles) {
        toast.error(`สามารถอัพโหลดได้สูงสุด ${maxFiles} ไฟล์`);
        break;
      }

      // Create mock file URL (in real app, this would be uploaded to server)
      const mockUrl = `https://example.com/files/${Date.now()}-${file.name}`;

      const propertyFile: PropertyFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        url: mockUrl,
        type: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString()
      };

      newFiles.push(propertyFile);
    }

    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);

    if (newFiles.length > 0) {
      toast.success(`อัพโหลดไฟล์สำเร็จ ${newFiles.length} ไฟล์`);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (fileId: string) => {
    const updatedFiles = files.filter(file => file.id !== fileId);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
    toast.success('ลบไฟล์เรียบร้อยแล้ว');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card>
        <CardContent className="p-4">
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={32} className="mx-auto mb-2 text-gray-400" />
            <p className="text-sm font-medium text-gray-900">อัพโหลดไฟล์</p>
            <p className="text-xs text-gray-500 mt-1">
              คลิกที่นี่เพื่อเลือกไฟล์ หรือลากไฟล์มาวางที่นี่
            </p>
            <p className="text-xs text-gray-400 mt-1">
              รองรับไฟล์ทุกประเภท สูงสุด 10MB ต่อไฟล์ (สูงสุด {maxFiles} ไฟล์)
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileSelect}
            accept="*/*"
          />
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <Card>
          <CardContent className="p-3">
            <h4 className="text-sm font-medium text-gray-900 mb-2">ไฟล์ที่อัพโหลด ({files.length})</h4>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {files.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <div className="flex items-center min-w-0">
                    <FileText size={16} className="mr-2 text-blue-600 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)} • {file.type || 'Unknown type'}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeFile(file.id)}
                    className="text-red-600 hover:text-red-700 shrink-0 ml-2"
                  >
                    <X size={14} />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
