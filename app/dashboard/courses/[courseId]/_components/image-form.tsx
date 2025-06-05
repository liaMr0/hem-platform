"use client";

import { useEffect, useState } from "react";
import { ImageIcon, Pencil, PlusCircle, Upload, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const ImageForm = ({ initialData, courseId }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (file) {
      async function uploadFile() {
        try {
          setIsUploading(true);
          
          const formData = new FormData();
          formData.append("files", file[0]);
          formData.append("destination", "./public/assets/images/courses");
          formData.append("courseId", courseId);
          
          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error subiendo la imagen");
          }
          
          const result = await response.json();
          console.log("Upload result:", result);
          
          if (response.status === 200) {
            // Actualiza con el nombre de archivo devuelto por la API
            initialData.imageUrl = `/assets/images/courses/${result.filename}`;
            toast.success("Imagen subida correctamente");
            toggleEdit();
            router.refresh(); 
          }
        } catch (e) {
          console.error("Upload error:", e);
          toast.error(e.message || "Error subiendo la imagen");
        } finally {
          setIsUploading(false);
          setFile(null);
        }
      }
      uploadFile();
    }
  }, [file]);

  const toggleEdit = () => setIsEditing((current) => !current);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    const file = files[0];
    
    // Validar que sea una imagen
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error("Solo se permiten archivos de imagen (JPEG, PNG, WebP, GIF)");
      return;
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("La imagen es demasiado grande. Máximo 5MB permitido");
      return;
    }

    setFile([file]);
  };

  const ImageUploadZone = () => (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
        dragActive 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
      } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => !isUploading && document.getElementById('imageInput').click()}
    >
      <input
        id="imageInput"
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleChange}
        disabled={isUploading}
      />
      
      {isUploading ? (
        <div className="space-y-2">
          <div className="animate-spin mx-auto h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          <p className="text-sm text-gray-600">Subiendo imagen...</p>
        </div>
      ) : (
        <div className="space-y-2">
          <Upload className="mx-auto h-8 w-8 text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-700">
              Arrastra una imagen aquí o haz clic para seleccionar
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, WebP o GIF (máximo 5MB)
            </p>
            <p className="text-xs text-gray-500">
              Relación 16:9 recomendada
            </p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="mt-6 border bg-gray-50 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Imagen del curso
        <Button variant="ghost" onClick={toggleEdit} disabled={isUploading}>
          {isEditing && <>Cancelar</>}
          {!isEditing && !initialData.imageUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Agregar una imagen
            </>
          )}
          {!isEditing && initialData.imageUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Editar imagen
            </>
          )}
        </Button>
      </div>
      
      {!isEditing &&
        (!initialData.imageUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md mt-2">
            <div className="text-center">
              <ImageIcon className="h-10 w-10 text-slate-500 mx-auto mb-2" />
              <p className="text-sm text-slate-600">No hay imagen del curso</p>
            </div>
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <Image
              alt="Imagen del curso"
              fill
              className="object-cover rounded-md"
              src={initialData.imageUrl}
              // onError={() => {
              //   console.error("Error loading image:", initialData.imageUrl);
              //   toast.error("Error cargando la imagen");
              // }}
            />
          </div>
        ))}
      
      {isEditing && (
        <div className="mt-4">
          <ImageUploadZone />
          <div className="text-xs text-muted-foreground mt-4 space-y-1">
            <p>• Relación de aspecto 16:9 recomendada</p>
            <p>• Formatos soportados: PNG, JPG, WebP, GIF</p>
            <p>• Tamaño máximo: 5MB</p>
          </div>
        </div>
      )}
    </div>
  );
};