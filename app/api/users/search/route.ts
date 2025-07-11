import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const email = url.searchParams.get("email")?.toLowerCase();

  if (!email) return NextResponse.json({ users: [] });

  const users = await prisma.user.findMany({
    where: {
      email: { contains: email },
      NOT: { id: session.user.id },
    },
    select: { id: true, email: true, name: true },
  });

  return NextResponse.json({ users });
}
