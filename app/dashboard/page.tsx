"use client";
import React from 'react';
import { StatsCards } from './users/_components/StatsCards';
import { useUserStats } from './users/_hooks/useUserStats';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { usePermissions } from './users/_hooks/usePermissions';
import StatsCardSkeleton from './users/_components/StatsCardSkeleton';
import { AdminDashboard } from './_components/AdminDashboard';
import { InstructorDashboard } from './_components/InstructorDashboard';

const DashboardPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const { isAuthorized, isLoading: authLoading } = usePermissions({
    session,
    status,
    router,
    requiredRole: ['admin', 'instructor'], // Permitir ambos roles
  });
  
  const { stats } = useUserStats({
    session,
    enabled: isAuthorized && session?.user?.role === 'admin', // Solo cargar stats para admin
  });

  if (authLoading) {
    return <StatsCardSkeleton />;
  }

  if (!isAuthorized) {
    return null; // usePermissions manejará la redirección
  }

  // Renderizado condicional basado en el rol
  const userRole = session?.user?.role;
  
  if (userRole === 'instructor') {
    return <InstructorDashboard />;
  }
  
  if (userRole === 'admin') {
    return <AdminDashboard stats={stats} />;
  }
  
  return null;
};

export default DashboardPage;