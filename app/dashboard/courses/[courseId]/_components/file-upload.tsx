"use client";

import { useEffect, useState, useRef } from "react";
import { FileIcon, Pencil, PlusCircle, Trash2, X, FileText, Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Document {
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedAt: Date;
}

interface FileUploadFormProps {
  initialData: {
    documents: Document[];
  };
  courseId: string;
}

export const FileUploadForm = ({ initialData, courseId }: FileUploadFormProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [existingFiles, setExistingFiles] = useState<Document[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Cargar documentos existentes desde initialData
    if (initialData?.documents && Array.isArray(initialData.documents)) {
      setExistingFiles(initialData.documents);
    } else {
      setExistingFiles([]);
    }
  }, [initialData]);

  const toggleEdit = () => {
    setIsEditing((current) => !current);
    setSelectedFiles([]);
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    addFiles(files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('border-blue-500', 'bg-blue-50');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      addFiles(files);
    }
  };

  const addFiles = (files: File[]) => {
    // Validación de tipo de archivo
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    const validFiles = files.filter(file => validTypes.includes(file.type));
    
    if (validFiles.length !== files.length) {
      toast.error("Solo se permiten archivos PDF o Word");
    }
    
    if (validFiles.length === 0) return;
    
    // Limitar a 10 archivos en total (existentes + nuevos)
    const totalFiles = existingFiles.length + selectedFiles.length + validFiles.length;
    if (totalFiles > 10) {
      toast.error("Máximo 10 archivos permitidos en total");
      const remainingSlots = 10 - existingFiles.length - selectedFiles.length;
      if (remainingSlots <= 0) return;
      
      const filesToAdd = validFiles.slice(0, remainingSlots);
      setSelectedFiles(prev => [...prev, ...filesToAdd]);
    } else {
      setSelectedFiles(prev => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingFile = async (index: number) => {
    try {
      setIsPending(true);
      
      const fileToRemove = existingFiles[index];
      
      const response = await fetch(`/api/courses/${courseId}/documents`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: fileToRemove.fileName,
          fileUrl: fileToRemove.fileUrl
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error deleting document");
      }
      
      // Eliminar referencia al archivo del estado
      setExistingFiles(prev => prev.filter((_, i) => i !== index));
      
      toast.success("Documento eliminado correctamente");
      router.refresh();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.message || "Error al eliminar el archivo");
    } finally {
      setIsPending(false);
    }
  };

  const handleSave = async () => {
    if (selectedFiles.length === 0) {
      toast.error("No hay archivos seleccionados para subir");
      return;
    }
    
    try {
      setIsPending(true);
      
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });
      formData.append("courseId", courseId);
      
      const response = await fetch(`/api/courses/${courseId}/documents`, {
        method: "POST",
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error uploading files");
      }
      
      const result = await response.json();
      
      toast.success("Documentos subidos correctamente");
      toggleEdit();
      router.refresh();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.message || "Error al subir los archivos");
    } finally {
      setIsPending(false);
    }
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.toLowerCase().endsWith('.pdf')) {
      return <FileIcon className="h-5 w-5 text-red-500" />;
    } else if (fileName.toLowerCase().endsWith('.doc') || fileName.toLowerCase().endsWith('.docx')) {
      return <FileText className="h-5 w-5 text-blue-500" />;
    } else {
      return <FileIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = (fileUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mt-6 border bg-gray-50 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Documentos del curso
        <Button variant="ghost" onClick={toggleEdit} disabled={isPending}>
          {isEditing && "Cancelar"}
          {!isEditing && existingFiles.length === 0 && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Agregar Documentos
            </>
          )}
          {!isEditing && existingFiles.length > 0 && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Gestionar documentos
            </>
          )}
        </Button>
      </div>
      
      {!isEditing && (
        existingFiles.length === 0 ? (
          <div className="flex items-center justify-center h-40 bg-slate-200 rounded-md mt-2">
            <div className="text-center">
              <FileIcon className="h-10 w-10 text-slate-500 mx-auto mb-2" />
              <p className="text-sm text-slate-600">No hay documentos cargados</p>
            </div>
          </div>
        ) : (
          <div className="mt-2 space-y-2">
            {existingFiles.map((file, index) => (
              <div key={index} className="flex items-center p-3 bg-white rounded-md border hover:bg-gray-50 transition-colors">
                {getFileIcon(file.fileName)}
                <div className="ml-3 flex-grow min-w-0">
                  <p className="text-sm font-medium truncate">{file.fileName}</p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>{formatFileSize(file.fileSize)}</span>
                    <span>•</span>
                    <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => handleDownload(file.fileUrl, file.fileName)}
                    title="Descargar archivo"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                    onClick={() => removeExistingFile(index)}
                    disabled={isPending}
                    title="Eliminar archivo"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
      
      {isEditing && (
        <div>
          <div 
            ref={dropAreaRef}
            className="border-2 border-dashed border-gray-300 rounded-md p-6 mt-4 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-gray-50 transition"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileSelected}
              accept=".pdf,.doc,.docx"
              multiple
            />
            
            <div className="text-center">
              <FileIcon className="h-10 w-10 text-slate-500 mx-auto mb-2" />
              <p className="text-sm font-medium">
                Arrastra y suelta o haz clic para cargar
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Solo se permiten archivos PDF y Word (máximo 10 en total)
              </p>
              <p className="text-xs text-muted-foreground">
                Archivos actuales: {existingFiles.length}/10
              </p>
              
              {selectedFiles.length > 0 && (
                <div className="mt-4 w-full">
                  <p className="text-xs font-medium text-gray-700 mb-2">Archivos seleccionados:</p>
                  <div className="space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center p-2 bg-white rounded border bg-opacity-90">
                        {file.name.toLowerCase().endsWith('.pdf') ? (
                          <FileIcon className="h-4 w-4 text-red-500" />
                        ) : (
                          <FileText className="h-4 w-4 text-blue-500" />
                        )}
                        <div className="ml-2 flex-grow min-w-0">
                          <span className="text-xs font-medium truncate block">{file.name}</span>
                          <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="ml-2 p-0 h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(index);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-4 flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={toggleEdit}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              disabled={selectedFiles.length === 0 || isPending}
              onClick={handleSave}
            >
              {isPending ? "Guardando..." : `Guardar ${selectedFiles.length} archivo(s)`}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};