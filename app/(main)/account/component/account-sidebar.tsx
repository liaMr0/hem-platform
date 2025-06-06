"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Menu from "./account-menu";
import AvatarUpload from "./AvatarUpload";

interface UserData {
  name: string;
  email: string;
  role: string;
  designation?: string;
  firstName?: string;
  lastName?: string;
}

const AccountSidebar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Función para obtener datos actualizados del servidor
  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/me');
      if (response.ok) {
        const data = await response.json();
        setUserData({
          name: data.name || `${data.firstName || ''} ${data.lastName || ''}`.trim(),
          email: data.email,
          role: data.role,
          designation: data.designation,
          firstName: data.firstName,
          lastName: data.lastName
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      fetchUserData();
    } else if (status === 'unauthenticated') {
      setIsLoading(false);
    }
  }, [status, session]);

  // Escuchar eventos personalizados para actualizar datos
  useEffect(() => {
    const handleUserUpdate = () => {
      fetchUserData();
    };

    // Escuchar evento personalizado cuando se actualiza el usuario
    window.addEventListener('userUpdated', handleUserUpdate);

    return () => {
      window.removeEventListener('userUpdated', handleUserUpdate);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="lg:w-1/4 md:px-3">
        <div className="relative">
          <div className="p-6 rounded-md shadow dark:shadow-gray-800 bg-white dark:bg-slate-900">
            <div className="profile-pic text-center mb-5">
              <div className="flex justify-center mb-4">
                <div className="w-28 h-28 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="border-t border-gray-100 dark:border-gray-700">
              <Menu />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentUserData = userData || session?.user;

  return (
    <div className="lg:w-1/4 md:px-3">
      <div className="relative">
        <div className="p-6 rounded-md shadow dark:shadow-gray-800 bg-white dark:bg-slate-900">
          <div className="profile-pic text-center mb-5">
            <div>
              <div className="flex justify-center mb-4">
                <AvatarUpload
                  size={112}
                  showUploadIcon={true}
                  clickable={true}
                />
              </div>
              <div className="mt-4">
                <h5 className="text-lg font-semibold">
                  {currentUserData?.name || 'Usuario'}
                </h5>
                <p className="text-slate-400">{currentUserData?.email}</p>
                <p className="text-slate-700 text-sm font-bold">
                  Rol: {currentUserData?.role}
                </p>
                {userData?.designation && (
                  <p className="text-slate-600 text-sm">
                    {userData.designation}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-100 dark:border-gray-700">
            <Menu />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSidebar;