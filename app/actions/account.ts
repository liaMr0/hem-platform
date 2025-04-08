"use server"

import { User } from "@/model/user-model";
import { validatePassword } from "@/queries/users";
import { revalidatePath } from "next/cache"; 
import bcrypt from 'bcryptjs';
import { UserDocument } from "@/types/user-types"; 

interface UserUpdateData {
  name?: string;
  email?: string;
  password?: string;
 }


export async function updateUserInfo(email: string, updatedData: UserUpdateData): Promise<void> {
    try {
        const filter = { email: email };
        await User.findOneAndUpdate(filter, updatedData);
        revalidatePath('/account');
    } catch (error) {
        throw new Error(error as string);
    }
}

export async function changePassword(email: string, oldPassword: string, newPassword: string): Promise<void> {
    const isMatch = await validatePassword(email, oldPassword);
    
    if (!isMatch) {
        throw new Error("Please enter a valid current password");        
    }
    
    const filter = { email: email };
    const hashedPassword = await bcrypt.hash(newPassword, 5);

    const dataToUpadate: UserUpdateData = {
        password: hashedPassword
    };

    try { 
        await User.findOneAndUpdate(filter, dataToUpadate);
        revalidatePath('/account');
    } catch (error) {
        throw new Error(error as string);
    } 
}