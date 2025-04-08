import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";
import { PUBLIC_ROUTES, LOGIN, ROOT } from "@/lib/routes";
import { NextAuthConfig } from "next-auth";

// Asegura que authConfig tenga el tipo correcto para session.strategy
const typedAuthConfig: NextAuthConfig = {
  ...authConfig,
  session: {
    strategy: "jwt" as const  // Usamos 'as const' para asegurar el tipo literal
  }
};

const { auth } = NextAuth(typedAuthConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth;

  const isPublicRoute = PUBLIC_ROUTES.some((route) => nextUrl.pathname.startsWith(route)) || nextUrl.pathname === ROOT;

  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL(LOGIN, nextUrl));
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api/auth|_next|favicon.ico|.*\\..*).*)", // Exclude Next.js internal routes and API routes
    "/", // Include the root route
  ],
};