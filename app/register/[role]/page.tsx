import React from 'react';
import { SignupForm } from '../_components/signup-form';
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function RegisterPage({ params }) {
  // Extraer el rol de los parámetros
  const  { role } = await params || {};
 const session = await auth();
  console.log(session?.user);
  
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
    <div className='w-full flex-col h-screen flex items-center justify-center'>
      <div className='container'>
        <SignupForm role={role} />
      </div>
    </div>
  );
}