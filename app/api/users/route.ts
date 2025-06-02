// ===== 1. app/api/users/route.ts =====
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbConnect } from "@/service/mongo";
import { User } from "@/model/user-model";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

interface UserFilters {
  firstName?: string;
  lastName?: string;
  role?: string;
  status?: string;
  phone?: string;
  bio?: string;
  email?: string;
  search?: string;
}

interface PaginationOptions {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface UsersResponse {
  users: any[];
  totalUsers: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    await dbConnect();

    // Verificar permisos
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'instructor')) {
      return NextResponse.json({ error: "No tienes permisos para esta acción" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    
    // Extraer filtros
    const filters: UserFilters = {
      firstName: searchParams.get('firstName') || undefined,
      lastName: searchParams.get('lastName') || undefined,
      role: searchParams.get('role') || undefined,
      status: searchParams.get('status') || undefined,
      phone: searchParams.get('phone') || undefined,
      bio: searchParams.get('bio') || undefined,
      email: searchParams.get('email') || undefined,
      search: searchParams.get('search') || undefined,
    };

    // Extraer opciones de paginación
    const pagination: PaginationOptions = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '12'),
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc',
    };

    // Construir query de MongoDB
    const query: any = {};

    // Filtros específicos
    if (filters.role && filters.role !== 'all') {
      query.role = filters.role;
    }
    if (filters.status && filters.status !== 'all') {
      query.status = filters.status;
    }
    if (filters.email) {
      query.email = { $regex: filters.email, $options: 'i' };
    }
    if (filters.phone) {
      query.phone = { $regex: filters.phone, $options: 'i' };
    }

    // Búsqueda general
    if (filters.search) {
      query.$or = [
        { firstName: { $regex: filters.search, $options: 'i' } },
        { lastName: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } },
        { phone: { $regex: filters.search, $options: 'i' } },
      ];
    }

    // Configurar ordenamiento
    const sortOptions: any = {};
    sortOptions[pagination.sortBy] = pagination.sortOrder === 'desc' ? -1 : 1;

    // Calcular skip para paginación
    const skip = (pagination.page - 1) * pagination.limit;

    // Ejecutar queries
    const [users, totalUsers] = await Promise.all([
      User.find(query)
        .select('-password')
        .populate('approvedBy', 'firstName lastName')
        .sort(sortOptions)
        .skip(skip)
        .limit(pagination.limit)
        .lean(),
      User.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalUsers / pagination.limit);
    const hasNextPage = pagination.page < totalPages;
    const hasPrevPage = pagination.page > 1;

    const result: UsersResponse = {
      users,
      totalUsers,
      totalPages,
      currentPage: pagination.page,
      hasNextPage,
      hasPrevPage,
    };
    
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// Solo agregar el método POST a tu archivo existente
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    // Verificar permisos de admin
    const currentUser = session.user as any;
    if (currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: "No tienes permisos para crear usuarios" },
        { status: 403 }
      );
    }
    await dbConnect();
    const body = await request.json();
    const { firstName, lastName, email, password, role, status } = body;

    // Validaciones básicas
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: "Todos los campos requeridos deben estar completos" },
        { status: 400 }
      );
    }

    // Validar longitud de campos
    if (firstName.length < 2 || firstName.length > 50) {
      return NextResponse.json(
        { error: "El nombre debe tener entre 2 y 50 caracteres" },
        { status: 400 }
      );
    }

    if (lastName.length < 2 || lastName.length > 50) {
      return NextResponse.json(
        { error: "El apellido debe tener entre 2 y 50 caracteres" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 8 caracteres" },
        { status: 400 }
      );
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "El email no tiene un formato válido" },
        { status: 400 }
      );
    }

    // Validar rol
    const validRoles = ['student', 'instructor', 'admin'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Rol inválido" },
        { status: 400 }
      );
    }

    // Validar estado
    const validStatuses = ['pending', 'approved'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Estado inválido" },
        { status: 400 }
      );
    }

    // Verificar si el email ya existe
    const existingUser = await User.findOne({ 
      email: email.toLowerCase().trim() 
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Ya existe un usuario con este email" },
        { status: 409 }
      );
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear el usuario
    const userData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role,
      status,
      // Si se aprueba automáticamente, agregar información de aprobación
      ...(status === 'approved' && {
        approvedBy: currentUser.id,
        approvedAt: new Date()
      })
    };

    const newUser = new User(userData);
    await newUser.save();

    // Convertir a objeto plano para la respuesta (sin password)
    const userResponse = {
      _id: newUser._id.toString(),
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status,
      phone: newUser.phone,
      bio: newUser.bio,
      profilePicture: newUser.profilePicture,
      designation: newUser.designation,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
      approvedBy: newUser.approvedBy,
      approvedAt: newUser.approvedAt,
      lastLogin: newUser.lastLogin
    };

    return NextResponse.json(userResponse, { status: 201 });

  } catch (error) {
    console.error("Error creating user:", error);
    
    // Manejar errores específicos de MongoDB
    if (error instanceof Error) {
      if (error.message.includes('E11000')) {
        return NextResponse.json(
          { error: "Ya existe un usuario con este email" },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

