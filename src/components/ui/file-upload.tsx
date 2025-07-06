import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, FileText, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  acceptedFileTypes?: Record<string, string[]>;
  maxFileSize?: number;
  label: string;
  description?: string;
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  acceptedFileTypes = {
    'application/pdf': ['.pdf'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/msword': ['.doc']
  },
  maxFileSize = 10 * 1024 * 1024, // 10MB
  label,
  description,
  className
}) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setUploadedFile(file);
      setUploadStatus('success');
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxSize: maxFileSize,
    multiple: false
  });

  const removeFile = () => {
    setUploadedFile(null);
    setUploadStatus('idle');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={cn('w-full', className)}>
      <label className="block text-sm font-medium text-foreground mb-2">
        {label}
      </label>
      
      {uploadedFile ? (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{uploadedFile.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(uploadedFile.size)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {uploadStatus === 'success' && (
                <div className="bg-secondary/10 p-1 rounded-full">
                  <Check className="h-4 w-4 text-secondary" />
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={removeFile}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <Card
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer p-8',
            isDragActive && 'border-primary bg-primary/5',
            className
          )}
        >
          <input {...getInputProps()} />
          <div className="text-center space-y-4">
            <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            
            {isDragActive ? (
              <div>
                <p className="text-primary font-medium">Drop your file here</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-foreground font-medium">
                  Drag & drop your file here, or click to browse
                </p>
                {description && (
                  <p className="text-sm text-muted-foreground">{description}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Supports PDF, DOC, DOCX • Max {formatFileSize(maxFileSize)}
                </p>
              </div>
            )}
          </div>
        </Card>
      )}

      {fileRejections.length > 0 && (
        <div className="mt-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
          <p className="text-sm text-destructive">
            {fileRejections[0].errors[0].message}
          </p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;