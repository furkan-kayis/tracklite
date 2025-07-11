"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CreateProjectForm() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const createProject = async () => {
    if (!name.trim()) return;

    setLoading(true);
    const res = await fetch("/api/projects", {
      method: "POST",
      body: JSON.stringify({ name }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      const { id } = await res.json();
      router.push(`/projects/${id}`);
    } else {
      alert("Failed to create project");
    }

    setLoading(false);
  };

  return (
    <div>
      <h2 className="text-lg font-medium mb-2">Create New Project</h2>
      <div className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Project title"
          className="border px-3 py-2 rounded w-full"
        />
        <button
          onClick={createProject}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          Create
        </button>
      </div>
    </div>
  );
}
