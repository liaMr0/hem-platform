

// ===== 4. app/api/users/[id]/status/route.ts =====
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/service/mongo";
import { User } from "@/model/user-model";
import { auth } from "@/auth";
import mongoose from "mongoose";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { status } = await request.json();

    if (!status || !['pending', 'approved', 'rejected', 'suspended'].includes(status)) {
      return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
    }

    await dbConnect();
    
    // Verificar que el usuario actual sea admin o instructor
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'instructor')) {
      return NextResponse.json({ error: "No tienes permisos para esta acción" }, { status: 403 });
    }

    // Verificar que el ID sea válido
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "ID de usuario inválido" }, { status: 400 });
    }

    // Preparar datos de actualización
    const updateData: any = { status };

    // Si se aprueba, agregar información de aprobación
    if (status === 'approved') {
      updateData.approvedBy = currentUser._id;
      updateData.approvedAt = new Date();
    }

    const updatedUser = await User.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('approvedBy', 'firstName lastName').select('-password');

    if (!updatedUser) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error al actualizar estado:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}