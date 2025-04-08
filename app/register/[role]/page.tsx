import React from 'react';
import { SignupForm } from '../_components/signup-form';

export default async function RegisterPage({ params }) {
  // Extraer el rol de los parámetros
  const  { role } = await params || {};

  return (
    <div className='w-full flex-col h-screen flex items-center justify-center'>
      <div className='container'>
        <SignupForm role={role} />
      </div>
    </div>
  );
}