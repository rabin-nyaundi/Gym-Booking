import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

import bcrypt from "bcrypt";

export async function POST(req: Request) {
  const body = await req.json();
  try {
    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
        name: `${body.first_name} ${body.last_name}`,
      },
    });

    return NextResponse.json({ user });
  } catch (error: any) {
    const message = error?.message || error;
    console.log(error);
    return NextResponse.json(message, {
      status: 500,
    });
  }
}
