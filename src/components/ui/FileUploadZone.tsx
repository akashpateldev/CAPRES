import { useState, useCallback, useRef } from "react";
import { Upload, X, FileText, Archive, Presentation, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// File validation configuration
const FILE_CONFIG = {
  maxSize: 50 * 1024 * 1024, // 50MB
  allowedTypes: {
    'application/pdf': { ext: 'pdf', label: 'Report', icon: FileText },
    'application/zip': { ext: 'zip', label: 'Source Code', icon: Archive },
    'application/x-zip-compressed': { ext: 'zip', label: 'Source Code', icon: Archive },
    'application/vnd.ms-powerpoint': { ext: 'ppt', label: 'Presentation', icon: Presentation },
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': { ext: 'pptx', label: 'Presentation', icon: Presentation },
  },
  allowedExtensions: ['pdf', 'zip', 'ppt', 'pptx'],
};

export interface UploadedFile {
  file: File;
  id: string;
  progress: number;
  status: 'uploading' | 'complete' | 'error';
  error?: string;
}

interface FileUploadZoneProps {
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[] | ((prev: UploadedFile[]) => UploadedFile[])) => void;
  maxFiles?: number;
  disabled?: boolean;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

function getFileExtension(fileName: string): string {
  return fileName.split('.').pop()?.toLowerCase() || '';
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function validateFile(file: File): { valid: boolean; error?: string } {
  const ext = getFileExtension(file.name);
  
  // Check extension
  if (!FILE_CONFIG.allowedExtensions.includes(ext)) {
    return { 
      valid: false, 
      error: `Invalid file type (.${ext}). Allowed: PDF, ZIP, PPT, PPTX` 
    };
  }
  
  // Check size
  if (file.size > FILE_CONFIG.maxSize) {
    return { 
      valid: false, 
      error: `File too large (${formatFileSize(file.size)}). Maximum: 50MB` 
    };
  }
  
  return { valid: true };
}

function getFileIcon(fileName: string) {
  const ext = getFileExtension(fileName);
  if (ext === 'pdf') return FileText;
  if (ext === 'zip') return Archive;
  if (ext === 'ppt' || ext === 'pptx') return Presentation;
  return FileText;
}

function getFileTypeLabel(fileName: string): string {
  const ext = getFileExtension(fileName);
  if (ext === 'pdf') return 'Report';
  if (ext === 'zip') return 'Source Code';
  if (ext === 'ppt' || ext === 'pptx') return 'Presentation';
  return 'File';
}

export function FileUploadZone({
  files,
  onFilesChange,
  maxFiles = 10,
  disabled = false,
}: FileUploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);

  const simulateUpload = useCallback((uploadedFile: UploadedFile) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 25 + 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        onFilesChange(prev => 
          prev.map(f => 
            f.id === uploadedFile.id 
              ? { ...f, progress: 100, status: 'complete' as const }
              : f
          )
        );
      } else {
        onFilesChange(prev => 
          prev.map(f => 
            f.id === uploadedFile.id 
              ? { ...f, progress }
              : f
          )
        );
      }
    }, 150 + Math.random() * 100);
  }, [onFilesChange]);

  const processFiles = useCallback((newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    const remainingSlots = maxFiles - files.length;
    
    if (remainingSlots <= 0) {
      return;
    }
    
    const filesToProcess = fileArray.slice(0, remainingSlots);
    const newUploadedFiles: UploadedFile[] = [];
    
    filesToProcess.forEach(file => {
      const validation = validateFile(file);
      const uploadedFile: UploadedFile = {
        file,
        id: generateId(),
        progress: validation.valid ? 0 : 100,
        status: validation.valid ? 'uploading' : 'error',
        error: validation.error,
      };
      
      newUploadedFiles.push(uploadedFile);
    });
    
    onFilesChange([...files, ...newUploadedFiles]);
    
    // Simulate upload for valid files
    newUploadedFiles
      .filter(f => f.status === 'uploading')
      .forEach(f => simulateUpload(f));
  }, [files, maxFiles, onFilesChange, simulateUpload]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragOver(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDragOver(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    dragCounterRef.current = 0;
    
    if (disabled) return;
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
      processFiles(droppedFiles);
    }
  }, [disabled, processFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      processFiles(selectedFiles);
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  }, [processFiles]);

  const handleRemoveFile = useCallback((id: string) => {
    onFilesChange(files.filter(f => f.id !== id));
  }, [files, onFilesChange]);

  const handleBrowseClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const completedFiles = files.filter(f => f.status === 'complete').length;
  const hasErrors = files.some(f => f.status === 'error');

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={disabled ? undefined : handleBrowseClick}
        className={cn(
          "relative rounded-lg border-2 border-dashed p-8 text-center transition-all duration-200 cursor-pointer",
          isDragOver && !disabled
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-border bg-muted/30 hover:border-muted-foreground/50 hover:bg-muted/50",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.zip,.ppt,.pptx"
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled}
        />
        
        <div className={cn(
          "transition-transform duration-200",
          isDragOver && "scale-110"
        )}>
          <div className={cn(
            "mx-auto h-14 w-14 rounded-full flex items-center justify-center transition-colors",
            isDragOver ? "bg-primary/10" : "bg-muted"
          )}>
            <Upload className={cn(
              "h-7 w-7 transition-colors",
              isDragOver ? "text-primary" : "text-muted-foreground"
            )} />
          </div>
          
          <p className="mt-4 text-sm font-medium text-foreground">
            {isDragOver ? "Drop files here" : "Drag & drop files here"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            or click to browse
          </p>
        </div>
        
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
            <FileText className="h-3 w-3" /> PDF
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
            <Archive className="h-3 w-3" /> ZIP
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
            <Presentation className="h-3 w-3" /> PPT/PPTX
          </span>
        </div>
        
        <p className="mt-3 text-xs text-muted-foreground">
          Max 50MB per file • Up to {maxFiles} files
        </p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">
              Uploaded Files ({completedFiles}/{files.length})
            </span>
            {hasErrors && (
              <span className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Some files have errors
              </span>
            )}
          </div>
          
          <div className="space-y-2">
            {files.map((uploadedFile) => {
              const FileIcon = getFileIcon(uploadedFile.file.name);
              const isComplete = uploadedFile.status === 'complete';
              const isError = uploadedFile.status === 'error';
              
              return (
                <div
                  key={uploadedFile.id}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border p-3 transition-all",
                    isError 
                      ? "border-destructive/50 bg-destructive/5" 
                      : isComplete
                        ? "border-success/50 bg-success/5"
                        : "border-border bg-card"
                  )}
                >
                  {/* File Icon */}
                  <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg",
                    isError 
                      ? "bg-destructive/10" 
                      : isComplete
                        ? "bg-success/10"
                        : "bg-muted"
                  )}>
                    <FileIcon className={cn(
                      "h-5 w-5",
                      isError 
                        ? "text-destructive" 
                        : isComplete
                          ? "text-success"
                          : "text-muted-foreground"
                    )} />
                  </div>
                  
                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground truncate">
                        {uploadedFile.file.name}
                      </p>
                      {isComplete && (
                        <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                      )}
                      {isError && (
                        <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{getFileTypeLabel(uploadedFile.file.name)}</span>
                      <span>•</span>
                      <span>{formatFileSize(uploadedFile.file.size)}</span>
                    </div>
                    
                    {/* Progress Bar */}
                    {uploadedFile.status === 'uploading' && (
                      <div className="mt-2">
                        <Progress value={uploadedFile.progress} className="h-1.5" />
                      </div>
                    )}
                    
                    {/* Error Message */}
                    {isError && uploadedFile.error && (
                      <p className="mt-1 text-xs text-destructive">
                        {uploadedFile.error}
                      </p>
                    )}
                  </div>
                  
                  {/* Remove Button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile(uploadedFile.id);
                    }}
                    className="h-8 w-8 flex-shrink-0 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
