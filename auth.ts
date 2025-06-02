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

          if (!user) {
            console.error("User not found");
            throw new Error("Usuario no encontrado");
          }

          const isMatch = await bcrypt.compare(credentials.password, user.password);

          if (!isMatch) {
            console.error("Password Mismatch");
            throw new Error("Contraseña incorrecta");
          }

          // Validar el estado del usuario
          if (user.status === 'pending') {
            throw new Error("Tu cuenta está pendiente de aprobación. Por favor espera a que un administrador apruebe tu cuenta.");
          }

          if (user.status === 'rejected') {
            throw new Error("Tu cuenta ha sido rechazada. Contacta al administrador para más información.");
          }

          if (user.status === 'suspended') {
            throw new Error("Tu cuenta ha sido suspendida. Contacta al administrador para más información.");
          }

          // Solo permitir acceso si el estado es 'approved'
          if (user.status !== 'approved') {
            throw new Error("Tu cuenta no tiene permisos para acceder al sistema.");
          }

          // Actualizar último inicio de sesión
          await User.findByIdAndUpdate(user._id, {
            lastLogin: new Date()
          });

          // Retorna todos los datos necesarios desde authorize
          return {
            id: user._id.toString(),
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            image: user.profilePicture,
            status: user.status
          };

        } catch (err) {
          console.error("Authorization error:", err);
          // Lanzar el error para que NextAuth lo maneje
          throw err;
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
        token.image = user.image;
        token.status = user.status;
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
        session.user.image = token.image as string;
        session.user.status = token.status as string;
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