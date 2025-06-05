import { getCoursesByRole } from "@/lib/dashboard-helper";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { ObjectId } from "mongodb";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
 
const CoursesPage = async () => {
  const session = await auth();
  
  // Verificar autenticación
  if (!session?.user) {
    redirect('/');
  }

  const userRole = session.user.role;
  
  // Verificar que el usuario tenga permisos (admin o instructor)
  if (userRole !== 'admin' && userRole !== 'instructor') {
    redirect('/');
  }

  try {
    // Obtener cursos basado en el rol usando la nueva función unificada
    const rawCourses = await getCoursesByRole();
    
    // Aplicar sanitización pero asegurándonos de mantener el id
    const courses = sanitizeData(rawCourses);
    
    // Debug: verificar que los IDs están presentes
    console.log('Courses with IDs:', courses.map(c => ({ title: c.title, id: c.id, _id: c._id })));
    
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">
              {userRole === 'instructor' ? 'Mis Cursos' : 'Gestión de Cursos'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {userRole === 'instructor' 
                ? 'Administra tus cursos y contenido' 
                : 'Supervisa todos los cursos de la plataforma'
              }
            </p>
          </div>
          
        </div>

        {/* Mostrar estadísticas básicas */}
        {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <div className="rounded-lg border p-3">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="text-sm font-medium">Total de Cursos</div>
            </div>
            <div className="text-2xl font-bold">{courses.length}</div>
            <p className="text-xs text-muted-foreground">
              {userRole === 'instructor' ? 'Cursos creados por ti' : 'En toda la plataforma'}
            </p>
          </div>
          
          <div className="rounded-lg border p-3">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="text-sm font-medium">Cursos Activos</div>
            </div>
            <div className="text-2xl font-bold">
              {courses.filter((course: any) => course.active).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Publicados y disponibles
            </p>
          </div>

          <div className="rounded-lg border p-3">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="text-sm font-medium">Borradores</div>
            </div>
            <div className="text-2xl font-bold">
              {courses.filter((course: any) => !course.active).length}
            </div>
            <p className="text-xs text-muted-foreground">
              En desarrollo
            </p>
          </div>

          {/* Solo mostrar estadística de instructores para admin */}
          {/* {userRole === 'admin' && (
            <div className="rounded-lg border p-3">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="text-sm font-medium">Instructores</div>
              </div>
              <div className="text-2xl font-bold">
                {new Set(courses.map((course: any) => course.instructor?._id || course.instructor?.id)).size}
              </div>
              <p className="text-xs text-muted-foreground">
                Creadores de contenido
              </p>
            </div>
          )} */}
        {/* </div> */} 

        {/* Tabla de cursos usando tus componentes existentes */}
        <DataTable 
          columns={columns} 
          data={courses}
        />

        {/* Mensaje si no hay cursos */}
        {courses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold">
                {userRole === 'instructor' ? 'No tienes cursos creados' : 'No hay cursos en la plataforma'}
              </h3>
              <p className="text-muted-foreground mt-2">
                {userRole === 'instructor' 
                  ? 'Comienza creando tu primer curso para compartir conocimientos con los estudiantes.'
                  : 'Los instructores aún no han creado cursos en la plataforma.'
                }
              </p>
              {(userRole === 'instructor' || userRole === 'admin') && (
                <Link href="/dashboard/courses/add">
                  <Button className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Crear Primer Curso
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error loading courses:", error);
    
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-destructive">Error al cargar los cursos</h3>
            <p className="text-muted-foreground mt-2">
              Ha ocurrido un error al intentar cargar los cursos. Por favor, intenta de nuevo.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Reintentar
            </Button>
          </div>
        </div>
      </div>
    );
  }
};

// Función mejorada para sanitizar datos manteniendo los IDs
function sanitizeData(data: any) {
  return JSON.parse(
    JSON.stringify(data, (key, value) => {
      if (value instanceof ObjectId) {
        return value.toString();
      }
      if (Buffer.isBuffer(value)) {
        return value.toString("base64");
      }
      return value;
    })
  );
}

export default CoursesPage;