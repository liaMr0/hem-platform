// import { replaceMongoIdInArray, replaceMongoIdInObject } from "@/lib/convertData";  
// import { User } from "@/model/user-model";
// import bcrypt from "bcryptjs";

// export async function getUserByEmail(email: string) {
//     const user = await User.findOne({ email }).lean();
//     return user ? replaceMongoIdInObject(user) : null;
// }

// export async function getUserDetails(userId:string){
//     const user = await User.findById(userId).lean();
//     return replaceMongoIdInObject(user);
// } 

// export async function validatePassword(email:string, password:string){
//     const user = await getUserByEmail(email);
//     const isMatch = await bcrypt.compare(
//         password,
//         user.password
//     );
//     return isMatch
// }
import { User } from "@/model/user-model";
import bcrypt from "bcryptjs";

export async function getUserByEmail(email: string) {
    const user = await User.findOne({ email }).lean();
    if (!user) return null;
    
    // Convert to plain object and serialize properly
    const serializedUser = {
        id: user._id?.toString() || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        role: user.role || '',
        status: user.status || '',
        phone: user.phone || '',
        bio: user.bio || '',
        designation: user.designation || '',
        profilePicture: user.profilePicture || '',
        createdAt: user.createdAt?.toISOString() || '',
        updatedAt: user.updatedAt?.toISOString() || '',
        lastLogin: user.lastLogin?.toISOString() || null,
        approvedAt: user.approvedAt?.toISOString() || null,
        approvedBy: user.approvedBy?.toString() || null,
        socialMedia: user.socialMedia ? Object.fromEntries(user.socialMedia) : {}
    };
    
    return serializedUser;
}

export async function getUserDetails(userId: string) {
    const user = await User.findById(userId).lean();
    if (!user) return null;
    
    // Apply the same serialization logic
    const serializedUser = {
        id: user._id?.toString() || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        role: user.role || '',
        status: user.status || '',
        phone: user.phone || '',
        bio: user.bio || '',
        designation: user.designation || '',
        profilePicture: user.profilePicture || '',
        createdAt: user.createdAt?.toISOString() || '',
        updatedAt: user.updatedAt?.toISOString() || '',
        lastLogin: user.lastLogin?.toISOString() || null,
        approvedAt: user.approvedAt?.toISOString() || null,
        approvedBy: user.approvedBy?.toString() || null,
        socialMedia: user.socialMedia ? Object.fromEntries(user.socialMedia) : {}
    };
    
    return serializedUser;
}

export async function validatePassword(email: string, password: string) {
    const user = await User.findOne({ email }).lean();
    if (!user) return false;
    
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch;
}

// types/user.ts
export interface SerializedUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  phone: string;
  bio: string;
  designation: string;
  profilePicture: string;
  createdAt: string;
  updatedAt: string;
  lastLogin: string | null;
  approvedAt: string | null;
  approvedBy: string | null;
  socialMedia: Record<string, string>;
}

// For client components that only need basic user info
export interface BasicUserInfo {
  firstName: string;
  lastName: string;
  email: string;
  designation: string;
  bio: string;
  phone?: string;
  profilePicture?: string;
}