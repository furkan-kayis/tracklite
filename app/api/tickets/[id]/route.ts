import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ticket = await prisma.ticket.findUnique({
    where: { id: params.id },
    include: { project: true },
  });

  if (!ticket || ticket.project.ownerId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const data = await req.json();
  const isInvalidData =
    !data ||
    typeof data !== "object" ||
    Array.isArray(data) ||
    Object.keys(data).length <= 0;

  if (isInvalidData) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  await prisma.ticket.update({
    where: { id: params.id },
    data,
  });

  return NextResponse.json({ ok: true });
}
