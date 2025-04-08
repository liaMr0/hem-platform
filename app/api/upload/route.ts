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
        const extension = originalName.split('.').pop();

        // Crear nombre único para evitar colisiones
        const uniqueFilename = `${courseId}_${Date.now()}.${extension}`;
        const filePath = path.join(destinationPath, uniqueFilename);
        
        // Guardar el archivo
        await writeFile(filePath, buffer);
        
        // Actualizar el curso con el nuevo nombre de archivo
        await updateCourse(courseId, { thumbnail: uniqueFilename });

        return NextResponse.json({ 
            message: `File uploaded successfully`,
            filename: uniqueFilename
        }, { status: 200 });

    } catch (err) {
        console.error("Error uploading file:", err);
        return NextResponse.json({ 
            error: err.message || "Error uploading file" 
        }, { status: 500 });
    }
}