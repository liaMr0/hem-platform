

// ===== 6. app/api/users/bulk-delete/route.ts =====
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

    // Verificar que no se incluya el propio usuario
    if (userIds.includes(currentUser._id.toString())) {
      return NextResponse.json({ error: "No puedes eliminar tu propia cuenta" }, { status: 400 });
    }

    const result = await User.deleteMany({ _id: { $in: userIds } });

    return NextResponse.json({ 
      message: "Usuarios eliminados correctamente",
      count: result.deletedCount
    });
  } catch (error) {
    console.error("Error en eliminación masiva:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}