import { LoginForm } from "./_components/login-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
const LoginPage = async() => {
  const session = await auth();

  if (session?.user) {
    const role = session.user.role;
    if (role === 'admin') {
      redirect('/dashboard');
    } else if (role === 'instructor') {
      redirect('/');
    }else if (role === 'student') {
      redirect('/');
    }
  }

  return (
    <div className="w-full flex-col h-screen flex items-center justify-center">
      <div className="container">
        <LoginForm />
      </div>
    </div>
  );
};
export default LoginPage;
