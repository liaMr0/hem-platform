// app/api/courses/[courseId]/documents/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Course } from "@/model/course-model";
import { getLoggedInUser } from "@/lib/loggedin-user";
import { writeFile, unlink, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";
import mongoose from "mongoose";

// Función helper para verificar permisos
async function canModifyCourse(courseId: string): Promise<boolean> {
  const loggedInUser = await getLoggedInUser();
  
  if (!loggedInUser) {
    return false;
  }

  if (loggedInUser.role === 'admin') {
    return true;
  }

  if (loggedInUser.role === 'instructor') {
    const course = await Course.findById(courseId).lean();
    if (!course) {
      return false;
    }
    
    return course.instructor.toString() === loggedInUser.id;
  }

  return false;
}

// POST - Subir nuevos documentos
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;
    
    // Verificar permisos
    const canModify = await canModifyCourse(courseId);
    if (!canModify) {
      return NextResponse.json(
        { error: "No tienes permisos para modificar este curso" },
        { status: 403 }
      );
    }

    // Verificar que el curso existe
    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json(
        { error: "Curso no encontrado" },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No se encontraron archivos" },
        { status: 400 }
      );
    }

    // Validar número total de documentos
    const currentDocuments = course.documents || [];
    if (currentDocuments.length + files.length > 10) {
      return NextResponse.json(
        { error: "Máximo 10 documentos permitidos por curso" },
        { status: 400 }
      );
    }

    // Crear directorio si no existe
    const uploadsDir = path.join(process.cwd(), "public/assets/documents/courses");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    const uploadedDocuments = [];

    for (const file of files) {
      // Validar tipo de archivo
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];

      if (!validTypes.includes(file.type)) {
        continue; // Saltar archivos no válidos
      }

      // Generar nombre único para el archivo
      const timestamp = Date.now();
      const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${courseId}_${timestamp}_${originalName}`;
      const filePath = path.join(uploadsDir, fileName);

      // Guardar archivo
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);

      // Crear objeto documento
      const document = {
        fileName: file.name,
        fileUrl: `/assets/documents/courses/${fileName}`,
        fileType: file.type,
        fileSize: file.size,
        uploadedAt: new Date()
      };

      uploadedDocuments.push(document);
    }

    if (uploadedDocuments.length === 0) {
      return NextResponse.json(
        { error: "No se pudieron procesar los archivos" },
        { status: 400 }
      );
    }

    // Actualizar curso con nuevos documentos
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: { documents: { $each: uploadedDocuments } },
        modifiedOn: new Date()
      },
      { new: true }
    );

    return NextResponse.json(
      {
        message: "Documentos subidos correctamente",
        documents: uploadedDocuments,
        total: updatedCourse.documents.length
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error uploading documents:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar un documento específico
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;
    const { fileName, fileUrl } = await request.json();
    
    // Verificar permisos
    const canModify = await canModifyCourse(courseId);
    if (!canModify) {
      return NextResponse.json(
        { error: "No tienes permisos para modificar este curso" },
        { status: 403 }
      );
    }

    if (!fileName || !fileUrl) {
      return NextResponse.json(
        { error: "Nombre de archivo y URL son requeridos" },
        { status: 400 }
      );
    }

    // Buscar y eliminar el documento de la base de datos
    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json(
        { error: "Curso no encontrado" },
        { status: 404 }
      );
    }

    // Encontrar el documento a eliminar
    const documentIndex = course.documents.findIndex(
      (doc: any) => doc.fileName === fileName && doc.fileUrl === fileUrl
    );

    if (documentIndex === -1) {
      return NextResponse.json(
        { error: "Documento no encontrado" },
        { status: 404 }
      );
    }

    // Eliminar archivo físico
    try {
      const filePath = path.join(process.cwd(), "public", fileUrl);
      if (existsSync(filePath)) {
        await unlink(filePath);
      }
    } catch (fileError) {
      console.warn("Error eliminando archivo físico:", fileError);
      // Continuar aunque no se pueda eliminar el archivo físico
    }

    // Eliminar documento del array en la base de datos
    course.documents.splice(documentIndex, 1);
    course.modifiedOn = new Date();
    await course.save();

    return NextResponse.json(
      {
        message: "Documento eliminado correctamente",
        remainingDocuments: course.documents.length
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// GET - Obtener documentos de un curso (opcional, para debugging)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;
    
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return NextResponse.json(
        { error: "ID de curso inválido" },
        { status: 400 }
      );
    }

    const course = await Course.findById(courseId).select('documents').lean();
    
    if (!course) {
      return NextResponse.json(
        { error: "Curso no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        documents: course.documents || [],
        total: (course.documents || []).length
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error getting documents:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}