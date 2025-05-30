import { replaceMongoIdInArray, replaceMongoIdInObject } from "@/lib/convertData";  
import { User } from "@/model/user-model";
import bcrypt from "bcryptjs";

export async function getUserByEmail(email: string) {
    const user = await User.findOne({ email }).lean();
    return user ? replaceMongoIdInObject(user) : null;
}

export async function getUserDetails(userId:string){
    const user = await User.findById(userId).lean();
    return replaceMongoIdInObject(user);
} 

export async function validatePassword(email:string, password:string){
    const user = await getUserByEmail(email);
    const isMatch = await bcrypt.compare(
        password,
        user.password
    );
    return isMatch
}