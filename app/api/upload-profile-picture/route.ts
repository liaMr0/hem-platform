// app/api/upload-profile-picture/route.ts
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { dbConnect } from "@/service/mongo";
import { User } from "@/model/user-model";
import { existsSync } from "fs";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const formData = await req.formData();
    const file = formData.get("image") as File;
    const email = formData.get("email");

    if (!file || !email || typeof email !== "string") {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: "Tipo de archivo no válido. Solo se permiten JPEG, PNG y WebP" 
      }, { status: 400 });
    }

    // Validar tamaño del archivo (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ 
        error: "El archivo es muy grande. Máximo 5MB permitido" 
      }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Crear directorio si no existe
    const uploadDir = path.join(process.cwd(), "public/uploads/profile");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generar nombre único para el archivo
    const ext = file.name.split(".").pop()?.toLowerCase() || 'jpg';
    const fileName = `${uuidv4()}.${ext}`;
    const filePath = path.join(uploadDir, fileName);

    // Guardar archivo
    await writeFile(filePath, buffer);

    const imageUrl = `/uploads/profile/${fileName}`;

    // Actualizar usuario en la base de datos
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { profilePicture: imageUrl },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ 
        error: "Usuario no encontrado" 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      imageUrl,
      message: "Imagen de perfil actualizada exitosamente"
    });

  } catch (error) {
    console.error("Error uploading profile image:", error);
    return NextResponse.json({ 
      error: "Error interno del servidor" 
    }, { status: 500 });
  }
}