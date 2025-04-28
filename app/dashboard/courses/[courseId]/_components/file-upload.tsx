"use client";

import { useEffect, useState, useRef } from "react";
import { FileIcon, Pencil, PlusCircle, Trash2, X, FileText } from "lucide-react";
import { toast } from "sonner";
import * as z from "zod";
 
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  files: z.array(z.any()).min(1, {
    message: "At least one file is required",
  }),
});

export const FileUploadForm = ({ initialData, courseId }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [existingFiles, setExistingFiles] = useState<Array<{url: string, name: string}>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Convertir initialData a un array de archivos existentes
    if (initialData.fileUrl && initialData.fileName) {
      setExistingFiles([{ 
        url: initialData.fileUrl, 
        name: initialData.fileName 
      }]);
    } else if (initialData.files && Array.isArray(initialData.files)) {
      setExistingFiles(initialData.files);
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
    
    // Limitar a 4 archivos en total
    if (selectedFiles.length + validFiles.length > 4) {
      toast.error("Máximo 4 archivos permitidos");
      const remainingSlots = 4 - selectedFiles.length;
      if (remainingSlots <= 0) return;
      
      // Solo tomar los archivos que caben en los slots restantes
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
      
      const response = await fetch(`/api/upload-file?courseId=${courseId}&fileUrl=${encodeURIComponent(fileToRemove.url)}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error deleting document");
      }
      
      // Eliminar referencia al archivo
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
      selectedFiles.forEach((file, index) => {
        formData.append("files", file);
      });
      formData.append("courseId", courseId);
      formData.append("destination", ".public/assets/documents/courses");
      
      const response = await fetch("/api/upload-file", {
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
    if (fileName.endsWith('.pdf')) {
      return <FileIcon className="h-5 w-5 text-red-500" />;
    } else {
      return <FileText className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="mt-6 border bg-gray-50 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Documentos del curso
        <Button variant="ghost" onClick={toggleEdit}>
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
              Cambiar documentos
            </>
          )}
        </Button>
      </div>
      
      {!isEditing && (
        existingFiles.length === 0 ? (
          <div className="flex items-center justify-center h-40 bg-slate-200 rounded-md">
            <FileIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="mt-2 space-y-2">
            {existingFiles.map((file, index) => (
              <div key={index} className="flex items-center p-3 bg-white rounded-md border">
                {getFileIcon(file.name)}
                <div className="ml-3 flex-grow">
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-gray-500 truncate max-w-full">
                    {file.url}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-auto p-0 h-8 w-8"
                  onClick={() => removeExistingFile(index)}
                  disabled={isPending}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )
      )}
      
      {isEditing && (
        <div>
          <div 
            ref={dropAreaRef}
            className="border-2 border-dashed rounded-md p-6 mt-4 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition"
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
                Solo se permiten archivos PDF y Word (máximo 4)
              </p>
              
              {/* Mostrar archivos seleccionados dentro del área de dropzone */}
              {selectedFiles.length > 0 && (
                <div className="mt-4 w-full">
                  <p className="text-xs font-medium text-gray-500 mb-2">Archivos seleccionados:</p>
                  <div className="space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center p-2 bg-white rounded bg-opacity-70 border">
                        {file.name.endsWith('.pdf') ? (
                          <FileIcon className="h-4 w-4 text-red-500" />
                        ) : (
                          <FileText className="h-4 w-4 text-blue-500" />
                        )}
                        <span className="ml-2 text-xs truncate max-w-[150px]">{file.name}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="ml-auto p-0 h-6 w-6"
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
          
          <div className="mt-4 flex justify-end">
            <Button
              type="button"
              disabled={selectedFiles.length === 0 || isPending}
              onClick={handleSave}
            >
              {isPending ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};