import prisma from "@/lib/prisma";
import { ProjectInvite } from "@/components/project-invite";
import { TicketList } from "@/components/ticket-list";
import { notFound } from "next/navigation";

export default async function ProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      tickets: { include: { assignee: true } },
      members: true,
    },
  });

  if (!project) return notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{project.name}</h1>

      <ProjectInvite projectId={project.id} members={project.members} />
      <TicketList tickets={project.tickets} />
    </div>
  );
}
