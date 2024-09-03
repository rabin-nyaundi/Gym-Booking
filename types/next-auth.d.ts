import { User as PrismaUser } from "@prisma/client";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User extends PrismaUser {}
  interface Session {
    user: User & DefaultSession["user"];
  }
}
