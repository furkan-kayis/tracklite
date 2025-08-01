"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function NewTicketForm({
  projectId,
  members,
}: Readonly<{
  projectId: string;
  members: { id: string; name: string | null }[];
}>) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, projectId, assigneeId }),
    });

    if (res.ok) {
      setTitle("");
      setDescription("");
      router.refresh(); // Refresh project page to show new ticket
    } else {
      alert("Failed to create ticket");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mt-6">
      <h2 className="font-medium">Create New Ticket</h2>
      <input
        className="border px-3 py-2 rounded w-full"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        className="border px-3 py-2 rounded w-full"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        required
      />

      <select
        value={assigneeId}
        onChange={(e) => setAssigneeId(e.target.value)}
        className="border px-3 py-2 rounded w-full"
      >
        <option value="">Unassigned</option>
        {members.map((member) => (
          <option key={member.id} value={member.id}>
            {member.name || member.id}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Create Ticket
      </button>
    </form>
  );
}
