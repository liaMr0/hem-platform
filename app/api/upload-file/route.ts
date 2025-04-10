// app/api/upload/documents/route.js
import { NextResponse } from "next/server";
import { writeFile, mkdir, unlink } from "fs/promises";
import { join } from "path";
import { dbConnect } from "@/service/mongo";
import mongoose from "mongoose";
import { Course } from "@/model/course-model";

export async function POST(req) {
  try {
    // Conectar a la base de datos
    await dbConnect();
    
    const formData = await req.formData();
    const courseId = formData.get("courseId");
    const destination = formData.get("destination") || "./public/assets/documents/courses";
    
    // Obtener todos los archivos
    const files = formData.getAll("files");
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No se proporcionaron archivos" },
        { status: 400 }
      );
    }

    // Validar que no se supere el límite de 4 archivos
    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json(
        { error: "Curso no encontrado" },
        { status: 404 }
      );
    }
    
    // Verificar cuántos documentos ya tiene el curso
    const existingDocsCount = course.documents ? course.documents.length : 0;
    if (existingDocsCount + files.length > 4) {
      return NextResponse.json(
        { error: `Solo se permiten 4 documentos en total. Ya tienes ${existingDocsCount}.` },
        { status: 400 }
      );
    }

    // Crear directorio si no existe
    try {
      await mkdir(destination, { recursive: true });
    } catch (err) {
      // Si el directorio ya existe, no hay problema
    }

    const uploadedFiles = [];

    // Procesar cada archivo
    for (const file of files) {
      // Validar tipo de archivo
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!validTypes.includes(file.type)) {
        continue; // Saltamos los archivos inválidos
      }

      // Crear nombre de archivo único
      const timestamp = Date.now();
      const originalName = file.name.replace(/\s+/g, "-").toLowerCase();
      const filename = `${timestamp}-${originalName}`;

      // Ruta completa donde se guardará el archivo
      const filePath = join(process.cwd(), destination.replace("./public", "public"), filename);

      // Convertir el archivo a un Buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Escribir el archivo en el sistema de archivos
      await writeFile(filePath, buffer);

      // Preparar la información del documento
      const newDocument = {
        _id: new mongoose.Types.ObjectId(), // Generar un ID único para el documento
        fileName: file.name,
        fileUrl: `/assets/documents/courses/${filename}`,
        fileType: file.type,
        fileSize: buffer.length,
        uploadedAt: new Date()
      };

      // Añadir el documento al curso
      await Course.findByIdAndUpdate(
        courseId,
        {
          $push: { documents: newDocument },
          $set: { modifiedOn: new Date() }
        }
      );

      uploadedFiles.push(newDocument);
    }

    return NextResponse.json({
      success: true,
      files: uploadedFiles
    });
  } catch (error) {
    console.error("Error al subir los archivos:", error);
    return NextResponse.json(
      { error: "Error al procesar la subida de archivos" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    // Conectar a la base de datos
    await dbConnect();
    
    // Obtener los parámetros de consulta
    const url = new URL(req.url);
    const courseId = url.searchParams.get("courseId");
    const fileId = url.searchParams.get("fileId");

    if (!courseId || !fileId) {
      return NextResponse.json(
        { error: "Se requiere el ID del curso y el ID del archivo" },
        { status: 400 }
      );
    }

    // Obtener el curso
    const course = await Course.findById(courseId);
    
    if (!course) {
      return NextResponse.json(
        { error: "No se encontró el curso" },
        { status: 404 }
      );
    }

    // Buscar el documento a eliminar
    const documentToDelete = course.documents.find(doc => doc._id.toString() === fileId);
    
    if (!documentToDelete) {
      return NextResponse.json(
        { error: "No se encontró el documento en el curso" },
        { status: 404 }
      );
    }

    // Ruta del archivo a eliminar
    const fileUrl = documentToDelete.fileUrl;
    const filePath = join(process.cwd(), "public", fileUrl.replace(/^\//, ""));
    
    try {
      // Eliminar el archivo físico
      await unlink(filePath);
    } catch (err) {
      console.warn("No se pudo eliminar el archivo físico:", err);
      // Continuamos incluso si no se puede eliminar el archivo físico
    }

    // Eliminar el documento de la matriz de documentos
    await Course.findByIdAndUpdate(
      courseId,
      {
        $pull: { documents: { _id: fileId } },
        $set: { modifiedOn: new Date() }
      }
    );

    return NextResponse.json({
      success: true,
      message: "Documento eliminado correctamente"
    });
  } catch (error) {
    console.error("Error al eliminar el archivo:", error);
    return NextResponse.json(
      { error: "Error al procesar la eliminación del archivo" },
      { status: 500 }
    );
  }
}