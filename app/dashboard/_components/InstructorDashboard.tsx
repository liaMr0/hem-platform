// Componente para el dashboard del instructor
export const InstructorDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Panel del Instructor</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Mis Cursos</h3>
          <p className="text-gray-600">Gestiona tus cursos</p>
          <a 
            href="/dashboard/courses" 
            className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Ver Cursos
          </a>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Mis Cuestionarios</h3>
          <p className="text-gray-600">Gestiona tus cuestionarios</p>
          <a 
            href="/dashboard/quiz-sets" 
            className="mt-4 inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Ver Cuestionarios
          </a>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Crear Curso</h3>
          <p className="text-gray-600">Crea un nuevo curso</p>
          <a 
            href="/dashboard/courses/add" 
            className="mt-4 inline-block bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Crear Curso
          </a>
        </div>
      </div>
    </div>
  );
};


