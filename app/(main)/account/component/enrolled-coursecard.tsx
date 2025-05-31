import React from 'react';
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import Image from "next/image";
import { getReport } from '@/queries/reports';
import { CourseProgress } from '@/components/course-progress';
import { getCourseDetails } from '@/queries/courses';

const EnrolledCourseCard = async ({enrollment}:any) => {
    // Obtener el ID del curso correctamente (puede ser 'id' o '_id' dependiendo del procesamiento)
    const courseId = enrollment?.course?.id || enrollment?.course?._id;
    const studentId = enrollment?.student?.id || enrollment?.student?._id || enrollment?.student;
    
    // Validación de datos requeridos
    if (!courseId) {
        console.error('Course ID is missing in enrollment:', enrollment);
        return (
            <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
                <div className="flex items-center justify-center h-32 bg-gray-100 rounded-md">
                    <p className="text-red-500">Error: Datos del curso no disponibles</p>
                </div>
            </div>
        );
    }

    if (!studentId) {
        console.error('Student ID is missing in enrollment:', enrollment);
        return (
            <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
                <div className="flex items-center justify-center h-32 bg-gray-100 rounded-md">
                    <p className="text-red-500">Error: Datos del estudiante no disponibles</p>
                </div>
            </div>
        );
    }

    try {
        const filter = { course: courseId, student: studentId };
        const report = await getReport(filter);
        
        // Obtener detalles del curso
        const courseDetails = await getCourseDetails(courseId);
        const totalModuleCount = courseDetails?.modules?.length || 0;

        // Total de módulos completados
        const totalCompletedModules = report?.totalCompletedModeules?.length || 0;

        // Progreso total
        const totalProgress = totalModuleCount > 0 ? (totalCompletedModules / totalModuleCount) * 100 : 0;
        
        // Obtener cuestionarios y asignaciones
        const quizzes = report?.quizAssessment?.assessments || [];
        const totalQuizzes = quizzes.length;

        // Encontrar cuestionarios intentados
        const quizzesTaken = quizzes.filter((q: any) => q.attempted);
        
        // Encontrar cuántos cuestionarios se respondieron correctamente
        const totalCorrect = quizzesTaken.map((quiz: any) => {
            const item = quiz.options || [];
            return item.filter((o: any) => {
                return o.isCorrect === true && o.isSelected === true;
            });
        }).filter((elem: any) => elem.length > 0).flat();

        const marksFromQuizzes = totalCorrect?.length * 5 || 0;
        const otherMarks = report?.quizAssessment?.otherMarks || 0;
        const totalMarks = marksFromQuizzes + otherMarks;

        // Información del curso
        const courseTitle = enrollment?.course?.title || 'Título no disponible';
        const courseThumbnail = enrollment?.course?.thumbnail || 'default-thumbnail.jpg';
        const courseModules = enrollment?.course?.modules?.length || totalModuleCount;

        return (
            <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
                <div className="relative w-full aspect-video rounded-md overflow-hidden">
                    <Image
                        src={`/assets/images/courses/${courseThumbnail}`}
                        alt={courseTitle}
                        className="object-cover"
                        fill
                    />
                </div>
                <div className="flex flex-col pt-2">
                    <div className="text-lg md:text-base font-medium group-hover:text-sky-700 line-clamp-2">
                        {courseTitle}
                    </div>
                    <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
                        <div className="flex items-center gap-x-1 text-slate-500">
                            <BookOpen className="w-4" />
                            <span>{courseModules} Capítulos</span>
                        </div>
                    </div>
                    <div className="border-b pb-2 mb-2">
                        <div className="flex items-center justify-between">
                            <span className="text-md md:text-sm font-medium text-slate-700">
                                Módulos totales: {courseModules}
                            </span>
                            <div className="text-md md:text-sm font-medium text-slate-700">
                                Módulos completados: <Badge variant="success">{totalCompletedModules}</Badge>
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-md md:text-sm font-medium text-slate-700">
                                Cuestionarios totales: {totalQuizzes}
                            </span>
                            <div className="text-md md:text-sm font-medium text-slate-700">
                                Cuestionarios realizados: <Badge variant="success">{quizzesTaken?.length || 0}</Badge>
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-md md:text-sm font-medium text-slate-700">
                                Calificación de los cuestionarios:
                            </span>
                            <span className="text-md md:text-sm font-medium text-slate-700">
                                {marksFromQuizzes}
                            </span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-md md:text-sm font-medium text-slate-700">
                                Otros:
                            </span>
                            <span className="text-md md:text-sm font-medium text-slate-700">
                                {otherMarks}
                            </span>
                        </div>
                    </div> 
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-md md:text-sm font-medium text-slate-700">
                            Calificación total:
                        </span>
                        <span className="text-md md:text-sm font-medium text-slate-700">
                            {totalMarks}
                        </span>
                    </div>

                    <CourseProgress
                        size="sm"
                        value={totalProgress}
                        variant={totalProgress === 100 ? "success" : "default"}
                    />
                </div>
            </div>
        );
    } catch (error) {
        console.error('Error in EnrolledCourseCard:', error);
        return (
            <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
                <div className="flex items-center justify-center h-32 bg-gray-100 rounded-md">
                    <p className="text-red-500">Error al cargar el curso</p>
                </div>
            </div>
        );
    }
};

export default EnrolledCourseCard;