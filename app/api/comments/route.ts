import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { content, ticketId } = await req.json();

  if (!content || !ticketId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      ticketId,
      authorId: session.user.id,
    },
    include: {
      author: true,
    },
  });

  return NextResponse.json(comment);
}
