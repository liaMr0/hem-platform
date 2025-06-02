import { getAllQuizSets, getQuizSetsByInstructor } from "@/queries/quizzes";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const QuizSets = async () => {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/');
  }

  const userRole = session.user.role;
  
  // Verificar que el usuario tenga permisos
  if (userRole !== 'admin' && userRole !== 'instructor') {
    redirect('/');
  }

  let quzSetsall;
  
  // Obtener cuestionarios basado en el rol
  if (userRole === 'admin') {
    // Admin ve todos los cuestionarios
    quzSetsall = await getAllQuizSets();
  } else {
    // Instructor ve solo sus cuestionarios
    quzSetsall = await getQuizSetsByInstructor(session.user.id);
  }

  const mappedQuizSets = quzSetsall.map(q => {
    return {
      id: q.id,
      title: q.title,
      isPublished: q.active,
      totalQuiz: q.quizIds.length,
    }
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {userRole === 'instructor' ? 'Mis Cuestionarios' : 'Todos los Cuestionarios'}
        </h1>
       
      </div>
      <DataTable columns={columns} data={mappedQuizSets} />
    </div>
  );
};

export default QuizSets;