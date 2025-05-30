// api/register/route.ts
import { dbConnect } from "@/service/mongo";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { User } from "@/model/user-model";
import { getUserByEmail } from "@/queries/users";

export const POST = async (request: NextRequest) => {
    try {
        const { firstName, lastName, email, password, userRole } = await request.json();

        await dbConnect();

        const isExistingEmail = await getUserByEmail(email);

        if (isExistingEmail) {
            return NextResponse.json(
                { message: "El correo electrónico ya está en uso" },
                { status: 409 }
                );
        }

        const hashedPassword = await bcrypt.hash(password, 5);

        const newUser = {
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: userRole,
        };

        await User.create(newUser);

        return new NextResponse("User has been created", {
            status: 201,
        });

    } catch (error) {
        console.error("Error in user registration:", error);
        return new NextResponse((error as Error).message, {
            status: 500,
        });
    }
}
