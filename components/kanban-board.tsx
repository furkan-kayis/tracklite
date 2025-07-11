"use client";

import { useState } from "react";

type Ticket = {
  id: string;
  title: string;
  status: "OPEN" | "IN_PROGRESS" | "DONE";
};

type Props = {
  tickets: Ticket[];
};

const columns = ["OPEN", "IN_PROGRESS", "DONE"] as const;

export function KanbanBoard({ tickets }: Readonly<Props>) {
  const [boardTickets, setBoardTickets] = useState<Ticket[]>(tickets);

  // Simplified drag and drop handlers (for now just click buttons to change status)

  async function changeStatus(id: string, newStatus: (typeof columns)[number]) {
    setBoardTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );

    await fetch(`/api/tickets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
  }

  return (
    <div className="flex gap-6">
      {columns.map((col) => (
        <div key={col} className="flex-1 bg-gray-100 p-4 rounded">
          <h3 className="font-semibold mb-4">{col.replace("_", " ")}</h3>
          <div className="space-y-3">
            {boardTickets
              .filter((t) => t.status === col)
              .map((ticket) => (
                <div key={ticket.id} className="bg-white p-3 rounded shadow">
                  <div>{ticket.title}</div>
                  <div className="mt-2 space-x-1">
                    {columns
                      .filter((c) => c !== ticket.status)
                      .map((c) => (
                        <button
                          key={c}
                          onClick={() => changeStatus(ticket.id, c)}
                          className="text-xs px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                        >
                          Move to {c.replace("_", " ")}
                        </button>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
