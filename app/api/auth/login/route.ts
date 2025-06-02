// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { User } from '@/model/user-model';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Buscar usuario
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Verificar estado del usuario
    if (user.status === 'pending') {
      return NextResponse.json(
        { 
          error: 'Tu cuenta está pendiente de aprobación. Por favor espera a que un administrador apruebe tu cuenta.',
          errorType: 'pending'
        },
        { status: 403 }
      );
    }

    if (user.status === 'rejected') {
      return NextResponse.json(
        { 
          error: 'Tu cuenta ha sido rechazada. Contacta al administrador para más información.',
          errorType: 'rejected'
        },
        { status: 403 }
      );
    }

    if (user.status === 'suspended') {
      return NextResponse.json(
        { 
          error: 'Tu cuenta ha sido suspendida. Contacta al administrador para más información.',
          errorType: 'suspended'
        },
        { status: 403 }
      );
    }

    if (user.status !== 'approved') {
      return NextResponse.json(
        { 
          error: 'Tu cuenta no tiene permisos para acceder al sistema.',
          errorType: 'no_permission'
        },
        { status: 403 }
      );
    }

    // Si llegamos aquí, el usuario está aprobado
    // Actualizar último login
    await User.findByIdAndUpdate(user._id, {
      lastLogin: new Date()
    });

    // Retornar éxito - el frontend luego usará NextAuth para establecer la sesión
    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role,
        status: user.status
      }
    });

  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}