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
      async authorize(credentials: any) {
        if (!credentials) return null;

        try {
          const user = await User.findOne({ email: credentials.email });

          if (user) {
            const isMatch = await bcrypt.compare(credentials.password, user.password);

            if (isMatch) {
              // Retorna todos los datos necesarios desde authorize
              return {
                id: user._id.toString(),
                name: `${user.firstName} ${user.lastName}`, // Combina firstName y lastName
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.profilePicture
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
  },

  callbacks: {
    // El callback jwt se ejecuta cada vez que se crea o actualiza un JWT
    async jwt({ token, user }) {
      // Si user existe (primera vez que se autentica), añade la info al token
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.image = user.image; // Añade la imagen del perfil
      }
      return token;
    },

    // El callback session se ejecuta cada vez que se accede a la sesión
    async session({ session, token }) {
      // Añade la información del token a la sesión
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.image = token.image as string; // Añade la imagen del perfil
      }
      return session;
    }
  }
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authOptions);