import { auth } from "@/auth"
import { getUserByEmail } from "@/queries/users";
import { dbConnect } from "@/service/mongo";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
    const session = await auth();
    
    if (!session?.user) {
        return new NextResponse(`You are not authenticated!`, {
            status: 401,
        });
    }
    
    const userEmail = session.user.email;
    if (!userEmail) {
        return new NextResponse("User email not found in session", {
            status: 400,
        });
    }
    
    await dbConnect();
    
    try {
        const user = await getUserByEmail(userEmail);
        return new NextResponse(JSON.stringify(user), {
            status: 200,
        });
    } catch (err) {
        return new NextResponse((err as Error).message, {
            status: 500,
        });
    }
}