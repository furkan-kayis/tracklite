import TicketComments from "@/components/ticket-comments";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function TicketPage(params: { id: string }) {
  const ticket = await prisma.ticket.findUnique({
    where: { id: params.id },
    include: {
      comments: {
        orderBy: { createdAt: "desc" },
        include: { author: true },
      },
    },
  });

  if (!ticket) notFound();

  return (
    <TicketComments
      ticketId={ticket.id}
      comments={ticket.comments.map((c) => ({
        id: c.id,
        content: c.content,
        createdAt: c.createdAt.toISOString(),
        author: { name: c.author.name },
      }))}
    />
  );
}
