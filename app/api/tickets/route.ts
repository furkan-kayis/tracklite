import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, description, assigneeId, projectId } = await req.json();

  if (!title || !description || !projectId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const ticket = await prisma.ticket.create({
    data: {
      title,
      description,
      projectId,
      authorId: session.user.id,
      assigneeId: assigneeId || null,
    },
  });

  return NextResponse.json(ticket);
}
