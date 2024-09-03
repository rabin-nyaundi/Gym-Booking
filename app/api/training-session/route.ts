import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {

    const sessions = await prisma.trainingSession.findMany();

    return NextResponse.json({ data: sessions });
  } catch (error: any) {
    const message = error?.message || error;
    console.log(error?.response?.data);
    return NextResponse.json(
      { error: message },
      {
        status: 500,
      }
    );
  }
}
