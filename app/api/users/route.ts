// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getFilteredUsers } from '@/lib/users'; // Ajusta la ruta según tu estructura

export async function GET(request: NextRequest) {
  try {
    // Obtener parámetros de la URL
    const url = new URL(request.url);
    const firstName = url.searchParams.get('firstName') || '';
    const lastName = url.searchParams.get('lastName') || '';
    const role = url.searchParams.get('role') || '';
    const phone = url.searchParams.get('phone') || '';
    const bio = url.searchParams.get('bio') || '';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const sortBy = url.searchParams.get('sortBy') || 'firstName';
    const sortOrder = url.searchParams.get('sortOrder') as 'asc' | 'desc' || 'asc';

    // Llamar a la función de filtrado con los parámetros
    const result = await getFilteredUsers({
      firstName,
      lastName,
      role,
      phone,
      bio,
      page,
      limit,
      sortBy,
      sortOrder
    });

    // Devolver resultado
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    return NextResponse.json(
      { error: 'Error al obtener usuarios' },
      { status: 500 }
    );
  }
}