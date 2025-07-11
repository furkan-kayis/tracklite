"use client";

import { useState } from "react";

export default function TicketComments({
  ticketId,
  comments,
}: Readonly<{
  ticketId: string;
  comments: {
    id: string;
    content: string;
    createdAt: string;
    author: { name: string | null };
  }[];
}>) {
  const [content, setContent] = useState("");
  const [allComments, setAllComments] = useState(comments);

  async function submitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticketId, content }),
    });

    if (res.ok) {
      const newComment = await res.json();
      setAllComments([newComment, ...allComments]);
      setContent("");
    }
  }

  return (
    <div className="mt-6">
      <form onSubmit={submitComment} className="mb-4">
        <textarea
          className="w-full border rounded px-3 py-2"
          placeholder="Write a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Post
        </button>
      </form>

      <ul className="space-y-4">
        {allComments.map((c) => (
          <li key={c.id} className="border rounded p-3">
            <div className="text-sm text-gray-700">{c.content}</div>
            <div className="text-xs text-gray-500 mt-1">
              by {c.author.name || "Anonymous"} on{" "}
              {new Date(c.createdAt).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
