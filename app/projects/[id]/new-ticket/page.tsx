"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface User {
  id: string;
  name: string;
}

export default function NewTicket({ params }: { params: { id: string } }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [members, setMembers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/projects/${params.id}/members`)
      .then((res) => res.json())
      .then((data) => setMembers(data.members || []));
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/tickets", {
      method: "POST",
      body: JSON.stringify({
        title,
        description,
        assigneeId: assigneeId || null,
        projectId: params.id,
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const { error } = await res.json();
      setError(error);
    } else {
      router.push(`/projects/${params.id}`);
    }
  };

  return (
    <main className="max-w-md mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">New Ticket</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Description</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Assign To</Label>
          <select
            className="w-full border p-2 rounded"
            value={assigneeId}
            onChange={(e) => setAssigneeId(e.target.value)}
          >
            <option value="">Unassigned</option>
            {members.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
        {error && <p className="text-red-600">{error}</p>}
        <Button type="submit" className="w-full">
          Create Ticket
        </Button>
      </form>
    </main>
  );
}
