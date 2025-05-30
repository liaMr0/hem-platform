import {User} from "@/model/user-model";
import { dbConnect } from "@/service/mongo";

interface FilterOptions {
  firstName?: string;
  lastName?: string;
  role?: string;
  phone?: string;
  bio?: string;
  socialMedia?: {
    [key: string]: string;
  };
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export async function getFilteredUsers(filters: FilterOptions = {}) {
  try {
    // Establecer conexión a la base de datos
    await dbConnect();
    
    const {
      firstName,
      lastName,
      role,
      phone,
      bio,
      socialMedia,
      page = 1,
      limit = 10,
      sortBy = 'firstName',
      sortOrder = 'asc'
    } = filters;

    // Construir el objeto de consulta
    const query: any = {};

    // Agregar filtros de texto con búsqueda insensible a mayúsculas/minúsculas
    if (firstName) query.firstName = { $regex: firstName, $options: 'i' };
    if (lastName) query.lastName = { $regex: lastName, $options: 'i' };
    if (role) query.role = { $regex: role, $options: 'i' };
    if (phone) query.phone = { $regex: phone, $options: 'i' };
    if (bio) query.bio = { $regex: bio, $options: 'i' };

    // Filtrar por redes sociales
    if (socialMedia && Object.keys(socialMedia).length > 0) {
      Object.keys(socialMedia).forEach(platform => {
        query[`socialMedia.${platform}`] = { 
          $regex: socialMedia[platform], 
          $options: 'i' 
        };
      });
    }

    // Calcular skip para paginación
    const skip = (page - 1) * limit;

    // Crear objeto de ordenación
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Ejecutar la consulta con paginación y ordenación
    const users = await User.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    // Obtener el total de documentos para la paginación
    const total = await User.countDocuments(query);

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error("Error al filtrar usuarios:", error);
    throw new Error("No se pudieron obtener los usuarios filtrados");
  }
}