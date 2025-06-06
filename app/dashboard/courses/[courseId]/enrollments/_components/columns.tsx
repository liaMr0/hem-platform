"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { 
  ArrowUpDown, 
  MoreHorizontal, 
  Eye, 
  Mail, 
  Calendar,
  Clock,
  Trophy,
  User
} from "lucide-react";
import Link from "next/link";

// Función helper para formatear fechas
const formatDate = (date) => {
  if (!date) return 'N/A';
  try {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    return 'N/A';
  }
};

export const columns = [
  {
    id: "student",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <User className="mr-2 h-4 w-4" />
          Estudiante
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const enrollment = row.original;
      const studentName = enrollment.studentName || 'N/A';
      const studentEmail = enrollment.studentEmail || 'N/A';
      const profilePicture = enrollment.profilePicture || '/assets/images/avatar.png';
      
      return (
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={profilePicture} alt={studentName} />
            <AvatarFallback>
              {studentName !== 'N/A' ? studentName.split(' ').map(n => n[0]).join('').toUpperCase() : 'NA'}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{studentName}</div>
            <div className="text-sm text-muted-foreground flex items-center">
              <Mail className="mr-1 h-3 w-3" />
              {studentEmail}
            </div>
          </div>
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const nameA = rowA.original.studentName || '';
      const nameB = rowB.original.studentName || '';
      return nameA.localeCompare(nameB);
    },
  },
  {
    id: "status",
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Estado
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status") || 'active';
      const getStatusConfig = (status) => {
        switch (status) {
          case 'completed':
            return { label: 'Completado', className: 'bg-green-600' };
          case 'in-progress':
            return { label: 'En Progreso', className: 'bg-blue-600' };
          case 'not-started':
            return { label: 'No Iniciado', className: 'bg-gray-600' };
          case 'paused':
            return { label: 'Pausado', className: 'bg-yellow-600' };
          default:
            return { label: 'Activo', className: 'bg-blue-600' };
        }
      };
      
      const config = getStatusConfig(status);
      
      return (
        <Badge className={cn("text-white", config.className)}>
          {config.label}
        </Badge>
      );
    },
  },
  {
    id: "progress",
    accessorKey: "progress",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <Trophy className="mr-2 h-4 w-4" />
          Progreso
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const progress = row.getValue("progress") || 0;
      
      return (
        <div className="w-full max-w-[200px]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium">{progress}%</span>
            {progress === 100 && <Trophy className="h-4 w-4 text-yellow-500" />}
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      );
    },
  },
  {
    id: "quizMark",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Examen
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const quizMark = row.original.quizMark;
      
      if (!quizMark && quizMark !== 0) {
        return <span className="text-muted-foreground">No realizado</span>;
      }
      
      const getGradeColor = (mark) => {
        if (mark >= 80) return 'text-green-600';
        if (mark >= 60) return 'text-yellow-600';
        return 'text-red-600';
      };
      
      return (
        <div className={cn("font-medium", getGradeColor(quizMark))}>
          {quizMark}/100
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const markA = rowA.original.quizMark || 0;
      const markB = rowB.original.quizMark || 0;
      return markA - markB;
    },
  },
  {
    id: "enrollmentDate",
    accessorKey: "enrollmentDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <Calendar className="mr-2 h-4 w-4" />
          Matriculado
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const enrollmentDate = row.getValue("enrollmentDate");
      return (
        <div className="text-sm">
          {formatDate(enrollmentDate)}
        </div>
      );
    },
  },
  {
    id: "lastAccessed",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <Clock className="mr-2 h-4 w-4" />
          Último Acceso
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const lastAccessed = row.original.lastAccessed;
      
      if (!lastAccessed) {
        return <span className="text-muted-foreground">Nunca</span>;
      }
      
      const getTimeAgo = (date) => {
        try {
          const now = new Date();
          const accessDate = new Date(date);
          const diffInHours = Math.floor((now - accessDate) / (1000 * 60 * 60));
          
          if (diffInHours < 1) return 'Hace menos de 1 hora';
          if (diffInHours < 24) return `Hace ${diffInHours} horas`;
          const diffInDays = Math.floor(diffInHours / 24);
          if (diffInDays < 7) return `Hace ${diffInDays} días`;
          return formatDate(date);
        } catch (error) {
          return formatDate(date);
        }
      };
      
      return (
        <div className="text-sm">
          {getTimeAgo(lastAccessed)}
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const dateA = rowA.original.lastAccessed ? new Date(rowA.original.lastAccessed) : new Date(0);
      const dateB = rowB.original.lastAccessed ? new Date(rowB.original.lastAccessed) : new Date(0);
      return dateA.getTime() - dateB.getTime();
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const enrollment = row.original;
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/students/${enrollment.studentId}/progress`}>
                <Eye className="mr-2 h-4 w-4" />
                Ver Progreso Detallado
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`mailto:${enrollment.studentEmail}`}>
                <Mail className="mr-2 h-4 w-4" />
                Enviar Email
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default columns;