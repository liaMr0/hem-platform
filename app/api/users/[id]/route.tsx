import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/service/mongo";
import { User } from "@/model/user-model";
import { auth } from "@/auth";
import mongoose from "mongoose";

// Reemplaza la función DELETE en tu archivo de API con esta versión mejorada:

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Await params antes de usar sus propiedades
    const { id } = await params;

    await dbConnect();
    
    // Verificar que el usuario actual sea admin
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: "No tienes permisos para esta acción" }, { status: 403 });
    }

    // Verificar que el ID sea válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID de usuario inválido" }, { status: 400 });
    }

    // No permitir que un admin se elimine a sí mismo
    if (currentUser._id.toString() === id) {
      return NextResponse.json({ error: "No puedes eliminar tu propia cuenta" }, { status: 400 });
    }

    // Buscar el usuario a eliminar - usar findOneAndDelete para operación atómica
    const userToDelete = await User.findOneAndDelete({ _id: id });
    
    if (!userToDelete) {
      return NextResponse.json({ error: "Usuario no encontrado o ya eliminado" }, { status: 404 });
    }

    // Log para auditoría
    console.log(`Usuario eliminado por admin: ${currentUser.email}`, {
      deletedUserId: userToDelete._id,
      deletedUserEmail: userToDelete.email,
      adminId: currentUser._id
    });

    return NextResponse.json({ 
      message: "Usuario eliminado correctamente",
      deletedUser: {
        id: userToDelete._id,
        name: `${userToDelete.firstName} ${userToDelete.lastName}`,
        email: userToDelete.email
      }
    });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    
    // Manejo específico para errores de MongoDB
    if (error instanceof mongoose.Error.CastError) {
      return NextResponse.json({ error: "ID de usuario inválido" }, { status: 400 });
    }
    
    if (error instanceof mongoose.Error.DocumentNotFoundError) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }
    
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Await params antes de usar sus propiedades
    const { id } = await params;

    await dbConnect();
    
    // Verificar que el ID sea válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID de usuario inválido" }, { status: 400 });
    }

    const user = await User.findById(id)
      .populate('approvedBy', 'firstName lastName')
      .select('-password');

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const updateData = await request.json();
    
    // Await params antes de usar sus propiedades
    const { id } = await params;

    await dbConnect();
    
    // Verificar que el usuario actual sea admin o sea el mismo usuario
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const isAdmin = currentUser.role === 'admin';
    const isOwnProfile = currentUser._id.toString() === id;

    if (!isAdmin && !isOwnProfile) {
      return NextResponse.json({ error: "No tienes permisos para esta acción" }, { status: 403 });
    }

    // Verificar que el ID sea válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID de usuario inválido" }, { status: 400 });
    }

    // Filtrar campos que solo admin puede actualizar
    const allowedFields = ['firstName', 'lastName', 'phone', 'bio', 'designation'];
    const adminOnlyFields = ['role', 'status', 'email'];

    let filteredData: any = {};

    // Campos que cualquier usuario puede actualizar
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    });

    // Campos que solo admin puede actualizar
    if (isAdmin) {
      adminOnlyFields.forEach(field => {
        if (updateData[field] !== undefined) {
          filteredData[field] = updateData[field];
        }
      });

      // Si se aprueba, agregar información de aprobación
      if (updateData.status === 'approved') {
        filteredData.approvedBy = currentUser._id;
        filteredData.approvedAt = new Date();
      }
    }

    // Validaciones adicionales
    if (filteredData.role && !['student', 'instructor', 'admin'].includes(filteredData.role)) {
      return NextResponse.json({ error: "Rol inválido" }, { status: 400 });
    }

    if (filteredData.status && !['pending', 'approved', 'rejected', 'suspended'].includes(filteredData.status)) {
      return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      filteredData,
      { new: true, runValidators: true }
    ).populate('approvedBy', 'firstName lastName').select('-password');

    if (!updatedUser) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}