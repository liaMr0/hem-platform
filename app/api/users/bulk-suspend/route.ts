// ===== 5. app/api/users/bulk-suspend/route.ts =====
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbConnect } from "@/service/mongo";
import { User } from "@/model/user-model";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { userIds } = await request.json();
    
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json({ error: "IDs de usuarios requeridos" }, { status: 400 });
    }

    await dbConnect();

    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: "No tienes permisos para esta acción" }, { status: 403 });
    }

    const result = await User.updateMany(
      { _id: { $in: userIds } },
      { 
        status: 'suspended',
        suspendedBy: currentUser._id,
        suspendedAt: new Date()
      }
    );

    return NextResponse.json({ 
      message: "Usuarios suspendidos correctamente",
      count: result.modifiedCount
    });
  } catch (error) {
    console.error("Error en suspensión masiva:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}