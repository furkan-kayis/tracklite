"use client";

import { useState } from "react";

export default function ProjectInvite({
  projectId,
  members,
}: {
  projectId: string;
  members: { id: string; email: string; name: string }[];
}) {
  const [email, setEmail] = useState("");
  const [searchResults, setSearchResults] = useState<
    { id: string; email: string; name: string }[]
  >([]);
  const [message, setMessage] = useState("");

  const searchUsers = async () => {
    if (!email) return;
    const res = await fetch(`/api/users/search?email=${email}`);
    const data = await res.json();
    setSearchResults(data.users || []);
  };

  const inviteUser = async (userId: string) => {
    const res = await fetch(`/api/projects/${projectId}/add-member`, {
      method: "POST",
      body: JSON.stringify({ userId }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      setMessage("User invited successfully!");
      setSearchResults([]);
      setEmail("");
    } else {
      setMessage("Failed to invite user.");
    }
  };

  return (
    <div className="mt-8 border-t pt-6">
      <h3 className="text-lg font-semibold mb-2">Invite Member</h3>
      <input
        type="email"
        placeholder="Enter user email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <button
        onClick={searchUsers}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Search
      </button>

      {searchResults.length > 0 && (
        <ul className="mt-4 border rounded max-h-40 overflow-auto">
          {searchResults.map((user) => (
            <li key={user.id} className="p-2 flex justify-between items-center">
              <span>{user.name || user.email}</span>
              <button
                className="text-blue-700 underline"
                onClick={() => inviteUser(user.id)}
              >
                Invite
              </button>
            </li>
          ))}
        </ul>
      )}

      {message && <p className="mt-2 text-green-600">{message}</p>}
    </div>
  );
}
