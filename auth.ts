import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "./model/user-model";
import bcrypt from 'bcryptjs';
import { authConfig } from "./auth.config";
import { NextAuthConfig } from "next-auth";

const authOptions: NextAuthConfig = {
  ...authConfig,
  providers: [
    CredentialsProvider({
      async authorize(credentials:any) {
        if (!credentials) return null;

        try {
          const user = await User.findOne({ email: credentials.email });

          if (user) {
            const isMatch = await bcrypt.compare(credentials.password, user.password);

            if (isMatch) {
          
              return {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role
              };
            } else {
              console.error("Password Mismatch");
              throw new Error("Check your password");
            }
          } else {
            console.error("User not found");
            throw new Error("User not found");
          }
        } catch (err) {
          console.error(err);
          throw new Error(err as string);
        }
      }
    })
  ],

  session: {
    strategy: "jwt" as const
  }
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authOptions);