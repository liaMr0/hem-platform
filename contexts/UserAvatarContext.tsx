// contexts/UserAvatarContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

interface UserAvatarContextType {
  avatarUrl: string;
  isLoading: boolean;
  updateAvatar: (newUrl: string) => void;
  uploadAvatar: (file: File) => Promise<boolean>;
}

const UserAvatarContext = createContext<UserAvatarContextType | undefined>(undefined);

interface UserAvatarProviderProps {
  children: ReactNode;
}

export const UserAvatarProvider: React.FC<UserAvatarProviderProps> = ({ children }) => {
  const { data: session } = useSession();
  const [avatarUrl, setAvatarUrl] = useState<string>('/assets/images/user-128.png');
  const [isLoading, setIsLoading] = useState(false);

  // Cargar imagen inicial del usuario
  useEffect(() => {
    const fetchUserAvatar = async () => {
      if (!session?.user?.email) return;

      try {
        const response = await fetch('/api/me');
        const userData = await response.json();
        if (userData?.profilePicture) {
          setAvatarUrl(userData.profilePicture);
        }
      } catch (error) {
        console.error('Error fetching user avatar:', error);
      }
    };

    fetchUserAvatar();
  }, [session]);

  const updateAvatar = (newUrl: string) => {
    setAvatarUrl(newUrl);
  };

  const uploadAvatar = async (file: File): Promise<boolean> => {
    if (!session?.user?.email) return false;

    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('email', session.user.email);

      const response = await fetch('/api/upload-profile-picture', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Error al subir la imagen');

      const data = await response.json();
      setAvatarUrl(data.imageUrl);
      return true;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserAvatarContext.Provider 
      value={{ 
        avatarUrl, 
        isLoading, 
        updateAvatar, 
        uploadAvatar 
      }}
    >
      {children}
    </UserAvatarContext.Provider>
  );
};

export const useUserAvatar = () => {
  const context = useContext(UserAvatarContext);
  if (context === undefined) {
    throw new Error('useUserAvatar must be used within a UserAvatarProvider');
  }
  return context;
};