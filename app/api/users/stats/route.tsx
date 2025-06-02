
// ===== 2. app/api/users/stats/route.ts =====
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbConnect } from "@/service/mongo";
import { User } from "@/model/user-model";

interface UserStats {
  total: number;
  byStatus: {
    pending: number;
    approved: number;
    rejected: number;
    suspended: number;
  };
  byRole: {
    student: number;
    instructor: number;
    admin: number;
  };
  recentSignups: number;
  activeThisMonth: number;
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    await dbConnect();

    // Verificar permisos
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'instructor')) {
      return NextResponse.json({ error: "No tienes permisos para esta acción" }, { status: 403 });
    }

    // Calcular fecha de hace 7 días
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Calcular fecha de inicio del mes actual
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Obtener estadísticas usando agregación
    const [statusStats, roleStats, recentSignups, total] = await Promise.all([
      User.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ]),
      User.aggregate([
        { $group: { _id: "$role", count: { $sum: 1 } } }
      ]),
      User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      User.countDocuments()
    ]);

    // Procesar estadísticas por estado
    const byStatus = {
      pending: 0,
      approved: 0,
      rejected: 0,
      suspended: 0
    };

    statusStats.forEach((stat: any) => {
      if (stat._id in byStatus) {
        byStatus[stat._id as keyof typeof byStatus] = stat.count;
      }
    });

    // Procesar estadísticas por rol
    const byRole = {
      student: 0,
      instructor: 0,
      admin: 0
    };

    roleStats.forEach((stat: any) => {
      if (stat._id in byRole) {
        byRole[stat._id as keyof typeof byRole] = stat.count;
      }
    });

    const stats: UserStats = {
      total,
      byStatus,
      byRole,
      recentSignups,
      activeThisMonth: 0 // Puedes implementar la lógica para usuarios activos
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}