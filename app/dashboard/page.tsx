import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CreateProjectForm } from "@/components/create-project-form";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return redirect("/login");

  const projects = await prisma.project.findMany({
    where: {
      OR: [
        { ownerId: session.user.id },
        { members: { some: { id: session.user.id } } },
      ],
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-2xl mx-auto mt-12 space-y-8">
      <h1 className="text-2xl font-bold">Your Projects</h1>

      <ul className="space-y-2">
        {projects.map((project) => (
          <li key={project.id}>
            <Link
              href={`/projects/${project.id}`}
              className="block p-3 border rounded hover:bg-gray-100"
            >
              {project.name}
            </Link>
          </li>
        ))}
      </ul>

      <div className="pt-6 border-t">
        <CreateProjectForm />
      </div>
    </div>
  );
}
