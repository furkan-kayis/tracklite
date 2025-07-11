"use client";

import { useState } from "react";

export function StatusToggle({
  ticketId,
  currentStatus,
}: Readonly<{
  ticketId: string;
  currentStatus: string;
}>) {
  const [status, setStatus] = useState(currentStatus);

  const nextStatusMap: Record<string, string> = {
    OPEN: "IN_PROGRESS",
    IN_PROGRESS: "DONE",
    DONE: "OPEN",
  };

  async function changeStatus() {
    const newStatus = nextStatusMap[status];

    const res = await fetch(`/api/tickets/${ticketId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: newStatus }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      setStatus(newStatus);
    } else {
      alert("Failed to update status");
    }
  }

  return (
    <button onClick={changeStatus} className="px-2 py-1 text-sm rounded border">
      {status.replace("_", " ")}
    </button>
  );
}
