// app/api/users/[id]/role/route.ts
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/service/mongo";
import { User } from "@/model/user-model";
import { auth } from "@/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
 
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { role } = await request.json();
    
    if (!['student', 'instructor', 'admin'].includes(role)) {
      return NextResponse.json({ error: "Rol inválido" }, { status: 400 });
    }

    await dbConnect();
    
    // Verificar que el usuario actual sea admin
    const currentUser = await User.findOne({ email: session.user.email });
    // if (!currentUser || currentUser.role !== 'admin') {
    //   return NextResponse.json({ error: "No tienes permisos para esta acción" }, { status: 403 });
    // }

    // No permitir que un admin cambie su propio rol
    if (currentUser._id.toString() === params.id) {
      return NextResponse.json({ error: "No puedes cambiar tu propio rol" }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      params.id,
      { role },
      { new: true, runValidators: true }
    ).populate('approvedBy', 'firstName lastName');

    if (!updatedUser) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error al actualizar rol:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}