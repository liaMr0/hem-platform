"use server"
import { User } from "@/model/user-model";
import { validatePassword } from "@/queries/users";
import { revalidatePath } from "next/cache";
import bcrypt from 'bcryptjs';

interface UserUpdateData {
    firstName?: string;
    lastName?: string;
    name?: string;
    email?: string;
    designation?: string;
    bio?: string;
    password?: string;
}

interface UserFormData {
    firstName: string;
    lastName: string;
    email: string;
    designation: string;
    bio: string;
}

export async function updateUserInfo(email: string, updatedData: UserFormData): Promise<void> {
    try {
        const filter = { email: email };
        
        // Construir el objeto de actualización con el nombre completo
        const dataToUpdate: UserUpdateData = {
            firstName: updatedData.firstName,
            lastName: updatedData.lastName,
            name: `${updatedData.firstName} ${updatedData.lastName}`, // Combinar firstName y lastName
            designation: updatedData.designation,
            bio: updatedData.bio
        };

        await User.findOneAndUpdate(filter, dataToUpdate, { new: true });
        
        // Revalidar múltiples rutas para asegurar la actualización
        revalidatePath('/account');
        revalidatePath('/account/profile');
        revalidatePath('/', 'layout');
        
    } catch (error) {
        console.error('Error updating user info:', error);
        throw new Error(error as string);
    }
}

export async function changePassword(email: string, oldPassword: string, newPassword: string): Promise<void> {
    const isMatch = await validatePassword(email, oldPassword);
    
    if (!isMatch) {
        throw new Error("Esta contraseña no coincide con la contraseña actual.");
    }
    
    const filter = { email: email };
    const hashedPassword = await bcrypt.hash(newPassword, 5);
    
    const dataToUpdate: UserUpdateData = {
        password: hashedPassword
    };
    
    try {
        await User.findOneAndUpdate(filter, dataToUpdate);
        revalidatePath('/account');
    } catch (error) {
        throw new Error(error as string);
    }
}