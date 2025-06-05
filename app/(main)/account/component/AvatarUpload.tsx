// components/AvatarUpload.tsx
'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Camera, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useUserAvatar } from '@/contexts/UserAvatarContext';
import { cn } from '@/lib/utils';

interface AvatarUploadProps {
  size?: number;
  className?: string;
  showUploadIcon?: boolean;
  clickable?: boolean;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ 
  size = 112, 
  className = '',
  showUploadIcon = true,
  clickable = true
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { avatarUrl, isLoading, uploadAvatar } = useUserAvatar();
  const [imageError, setImageError] = useState(false);

  const handleImageClick = () => {
    if (clickable && !isLoading) {
      fileInputRef.current?.click();
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona un archivo de imagen válido');
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen debe ser menor a 5MB');
      return;
    }

    const success = await uploadAvatar(file);
    
    if (success) {
      toast.success('Imagen actualizada exitosamente');
      setImageError(false);
    } else {
      toast.error('No se pudo subir la imagen');
    }

    // Limpiar input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const displayUrl = imageError ? '/assets/images/avatar.png' : avatarUrl;

  return (
    <div className={cn('relative inline-block', className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageChange}
        disabled={isLoading}
      />
      
      <div 
        className={cn(
          'relative overflow-hidden rounded-full ring-4 ring-slate-50 dark:ring-slate-800 shadow dark:shadow-gray-800',
          clickable && !isLoading && 'cursor-pointer hover:ring-slate-200 dark:hover:ring-slate-700 transition-all duration-200',
          isLoading && 'opacity-75'
        )}
        style={{ width: size, height: size }}
        onClick={handleImageClick}
      >
        <Image
          src={displayUrl}
          alt="Foto de perfil"
          width={size}
          height={size}
          className="object-cover w-full h-full"
          onError={handleImageError}
          priority
          unoptimized={displayUrl.startsWith('/uploads')}
        />
        
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
        )}
        
        {/* Upload icon overlay */}
        {showUploadIcon && clickable && !isLoading && (
          <div className="absolute inset-0 bg-black/0 hover:bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
            <Camera className="w-6 h-6 text-white drop-shadow-lg" />
          </div>
        )}
      </div>
    </div>
  );
};

export default AvatarUpload;