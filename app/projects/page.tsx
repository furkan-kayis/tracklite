import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { StatusToggle } from "@/components/status-toggle";

interface Props {
  params: { id: string };
}

export default async function ProjectPage({ params }: Readonly<Props>) {
  const session = await getServerSession(authOptions);
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      tickets: {
        orderBy: { createdAt: "desc" },
        include: { assignee: true },
      },
      members: true,
    },
  });

  if (!project || project.ownerId !== session?.user?.id) {
    return (
      <div className="p-4 text-red-600">Project not found or unauthorized</div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">{project.name}</h1>
      <Link
        href={`/projects/${params.id}/new-ticket`}
        className="underline text-blue-600"
      >
        + New Ticket
      </Link>

      <h2 className="mt-8 mb-2 font-semibold text-lg">Tickets</h2>
      <ul className="space-y-2">
        {project.tickets.map((ticket) => (
          <li key={ticket.id} className="p-3 border rounded">
            <div className="font-medium">{ticket.title}</div>
            <div className="text-sm text-gray-600">{ticket.status}</div>
            {ticket.assignee && (
              <div className="text-sm text-gray-500">
                Assigned to: {ticket.assignee.name}
              </div>
            )}

            <StatusToggle ticketId={ticket.id} currentStatus={ticket.status} />
          </li>
        ))}
      </ul>
    </main>
  );
}
