import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { TicketComments } from "@/components/ticket-comments";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { UpdateTicketStatus } from "@/components/update-ticket-status";

export default async function TicketDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return notFound();

  const ticket = await prisma.ticket.findUnique({
    where: { id: params.id },
    include: {
      assignee: true,
      comments: {
        orderBy: { createdAt: "desc" },
        include: { author: true },
      },
      project: true,
    },
  });

  if (!ticket) return notFound();

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-6">
      <Link
        href={`/projects/${ticket.projectId}`}
        className="text-blue-500 text-sm"
      >
        &larr; Back to project
      </Link>

      <h1 className="text-2xl font-bold">{ticket.title}</h1>

      <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>

      <div className="text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span>Status:</span>
          <UpdateTicketStatus
            ticketId={ticket.id}
            currentStatus={ticket.status}
          />
        </div>
        <div>Assigned to: {ticket.assignee?.name || "Unassigned"}</div>
        <div>Project: {ticket.project.name}</div>
      </div>

      <TicketComments
        ticketId={ticket.id}
        comments={ticket.comments.map((c) => ({
          id: c.id,
          content: c.content,
          createdAt: c.createdAt.toISOString(),
          author: { name: c.author.name },
        }))}
      />
    </div>
  );
}
