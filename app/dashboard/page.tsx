import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Welcome, {session?.user?.name}</h1>
    </main>
  );
}
