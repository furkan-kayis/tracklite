"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { TicketStatus } from "@/app/generated/prisma";

export function UpdateTicketStatus({
  ticketId,
  currentStatus,
}: Readonly<{
  ticketId: string;
  currentStatus: string;
}>) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function updateStatus(newStatus: string) {
    if (newStatus === currentStatus) return;

    startTransition(async () => {
      await fetch(`/api/tickets/${ticketId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      router.refresh();
    });
  }

  return (
    <div className="flex gap-2">
      {Object.values(TicketStatus).map((status) => (
        <button
          key={status}
          onClick={() => updateStatus(status)}
          disabled={isPending}
          className={`px-3 py-1 rounded text-sm ${
            currentStatus === status
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {status}
        </button>
      ))}
    </div>
  );
}
