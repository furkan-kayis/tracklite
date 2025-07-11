"use client";

import { useState } from "react";
import { Ticket, TicketStatus, User } from "@/app/generated/prisma";
import { StatusToggle } from "@/components/status-toggle";
import Link from "next/link";

interface Props {
  tickets: (Ticket & { assignee: User | null })[];
}

type FilterStatus = TicketStatus | "ALL";

export function TicketList({ tickets }: Readonly<Props>) {
  const [filter, setFilter] = useState<FilterStatus>("ALL");

  const filteredTickets = tickets.filter((ticket) =>
    filter === "ALL" ? true : ticket.status === filter
  );

  const allStatuses: FilterStatus[] = ["ALL", ...Object.values(TicketStatus)];

  return (
    <div className="mt-6 space-y-4">
      <div className="flex gap-2 mb-2">
        {allStatuses.map((s) => (
          <button
            key={s}
            className={`px-2 py-1 border rounded ${
              filter === s ? "bg-gray-200" : ""
            }`}
            onClick={() => setFilter(s)}
          >
            {s.replace("_", " ")}
          </button>
        ))}
      </div>

      {filteredTickets.length === 0 ? (
        <p className="text-gray-500">No tickets found.</p>
      ) : (
        <ul className="space-y-2">
          {filteredTickets.map((ticket) => (
            <li
              key={ticket.id}
              className="p-3 border rounded flex justify-between items-center"
            >
              <div>
                <Link
                  href={`/tickets/${ticket.id}`}
                  className="font-medium hover:underline"
                >
                  {ticket.title}
                </Link>
                <div className="text-sm text-gray-600">
                  {ticket.description}
                </div>
                {ticket.assignee && (
                  <div className="text-sm text-gray-500">
                    Assigned to: {ticket.assignee.name}
                  </div>
                )}
              </div>
              <StatusToggle
                ticketId={ticket.id}
                currentStatus={ticket.status}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
