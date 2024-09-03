import prisma from "@/lib/prisma";
import { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

import { PrismaAdapter } from "@next-auth/prisma-adapter";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "",
      type: "credentials",
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        try {
          const user = await prisma.user.findUnique({
            where: {
              email: email,
            },
          });

          if (user && (await bcrypt.compare(password, user.password))) {
            return {
              ...user,
              id: user.id.toString(),
            };
          } else {
            return null;
          }
        } catch (error: any) {
          console.error("Error during authorization:", error);
          throw new Error("invalid login credentials");
        }
      },
    }),
  ],

  session: {
    maxAge: 8 * 60 * 60,
    strategy: "jwt",
  },

  pages: {
    signIn: "/auth/login",
  },

  secret: process.env.NEXTAUTH_SECRET,

  adapter: PrismaAdapter(prisma),

  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }: { session: Session; token: any }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.email = token.email;
      session.user.name = token.name;
      return session;
    },
  },
};
