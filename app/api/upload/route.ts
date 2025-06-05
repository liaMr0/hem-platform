import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';
import { writeFile } from 'fs/promises';
import { updateCourse } from "@/app/actions/course";

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get("files");
        const destination = formData.get("destination");
        const courseId = formData.get("courseId");

        if (!file) {
            return NextResponse.json(
                { error: "No file uploaded" },
                { status: 400 }
            );
        }

        if (!destination) {
            return NextResponse.json(
                { error: "Destination not provided" },
                { status: 400 }
            );
        }

        // Validar que el archivo sea una imagen
        const validImageTypes = [
            'image/jpeg',
            'image/jpg', 
            'image/png',
            'image/webp',
            'image/gif'
        ];

        if (!validImageTypes.includes(file.type)) {
            return NextResponse.json(
                { error: "Solo se permiten archivos de imagen (JPEG, PNG, WebP, GIF)" },
                { status: 400 }
            );
        }

        // Validar tamaño del archivo (máximo 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: "El archivo es demasiado grande. Máximo 5MB permitido" },
                { status: 400 }
            );
        }

        // Asegúrate de que exista el directorio de destino
        const destinationPath = path.join(process.cwd(), destination.replace('./public', 'public'));
        if (!fs.existsSync(destinationPath)) {
            fs.mkdirSync(destinationPath, { recursive: true });
        }

        // Crear un nombre de archivo único basado en la fecha y el nombre original
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Obtener extensión del archivo original
        const originalName = file.name;
        const extension = originalName.split('.').pop()?.toLowerCase();

        // Validar extensión nuevamente por si acaso
        const validExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
        if (!validExtensions.includes(extension)) {
            return NextResponse.json(
                { error: "Extensión de archivo no válida" },
                { status: 400 }
            );
        }

        // Crear nombre único para evitar colisiones
        const uniqueFilename = `${courseId}_${Date.now()}.${extension}`;
        const filePath = path.join(destinationPath, uniqueFilename);
        
        // Eliminar imagen anterior si existe
        if (courseId) {
            try {
                const course = await getCourseDetails(courseId);
                if (course?.thumbnail) {
                    const oldImagePath = path.join(destinationPath, course.thumbnail);
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                        console.log(`Imagen anterior eliminada: ${course.thumbnail}`);
                    }
                }
            } catch (error) {
                console.warn("Error eliminando imagen anterior:", error);
                // Continuar aunque no se pueda eliminar la imagen anterior
            }
        }
        
        // Guardar el archivo
        await writeFile(filePath, buffer);
        
        // Actualizar el curso con el nuevo nombre de archivo
        await updateCourse(courseId, { thumbnail: uniqueFilename });

        return NextResponse.json({ 
            message: `Imagen subida correctamente`,
            filename: uniqueFilename,
            fileSize: file.size,
            fileType: file.type
        }, { status: 200 });

    } catch (err) {
        console.error("Error uploading image:", err);
        return NextResponse.json({ 
            error: err.message || "Error subiendo la imagen" 
        }, { status: 500 });
    }
}