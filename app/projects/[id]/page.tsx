import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { ProjectInvite } from "@/components/project-invite";
import { TicketList } from "@/components/ticket-list";
import { NewTicketForm } from "@/components/new-ticket-form";

export default async function ProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return redirect("/login");

  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      members: true,
      tickets: { include: { assignee: true } },
    },
  });

  if (!project) return notFound();

  const isMember =
    project.ownerId === session.user.id ||
    project.members.some((m) => m.id === session.user.id);

  if (!isMember) return redirect("/unauthorized");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{project.name}</h1>
      <NewTicketForm projectId={project.id} members={project.members} />

      {project.ownerId === session.user.id && (
        <ProjectInvite projectId={project.id} members={project.members} />
      )}

      <TicketList tickets={project.tickets} />
    </div>
  );
}
