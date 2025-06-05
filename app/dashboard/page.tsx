"use client";
import React from 'react';
import { StatsCards } from './users/_components/StatsCards';
import { CourseStatsCards } from './_components/CourseStatsCards';
import { useUserStats } from './users/_hooks/useUserStats';
import { useCourseStats } from './_hooks/useCourseStats';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { usePermissions } from './users/_hooks/usePermissions';
import { useLoadingStates } from './_hooks/useLoadingStates';

// Skeletons
import AdminDashboardSkeleton from './_components/skeletons/AdminDashboardSkeleton';
import InstructorDashboardSkeleton from './_components/skeletons/InstructorDashboardSkeleton';
import DashboardLoadingSkeleton from './_components/skeletons/DashboardLoadingSkeleton';

// Components
import { AdminDashboard } from './_components/AdminDashboard';
import { InstructorDashboard } from './_components/InstructorDashboard';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const { isAuthorized, isLoading: authLoading } = usePermissions({
    session,
    status,
    router,
    requiredRole: ['admin', 'instructor'],
  });
  
  const { stats: userStats, isLoading: userStatsLoading } = useUserStats({
    session,
    enabled: isAuthorized && session?.user?.role === 'admin',
  });

  const { stats: courseStats, isLoading: courseStatsLoading } = useCourseStats({
    session,
    enabled: isAuthorized,
  });

  const { showSkeleton } = useLoadingStates({
    userStatsLoading,
    courseStatsLoading,
    authLoading
  });

  // Mostrar skeleton durante la carga inicial
  if (authLoading || status === 'loading') {
    return <DashboardLoadingSkeleton />;
  }

  if (!isAuthorized) {
    return null; // usePermissions manejará la redirección
  }

  const userRole = session?.user?.role;
  
  if (userRole === 'instructor') {
    if (showSkeleton) {
      return <InstructorDashboardSkeleton />;
    }
    return <InstructorDashboard courseStats={courseStats} />;
  }
  
  if (userRole === 'admin') {
    if (showSkeleton) {
      return <AdminDashboardSkeleton />;
    }
    return <AdminDashboard userStats={userStats} courseStats={courseStats} />;
  }
  
  return null;
};