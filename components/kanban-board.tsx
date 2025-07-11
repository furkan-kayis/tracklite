"use client";

import { TicketStatus } from "@/app/generated/prisma";
import { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

type Ticket = {
  id: string;
  title: string;
  status: TicketStatus;
};

type Props = {
  tickets: Ticket[];
};

const columns = ["OPEN", "IN_PROGRESS", "DONE"] as const;

export function KanbanBoard({ tickets }: Readonly<Props>) {
  const [boardTickets, setBoardTickets] = useState<Ticket[]>(tickets);

  function onDragEnd(result: DropResult) {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    // Find the ticket
    const ticket = boardTickets.find((t) => t.id === draggableId);
    if (!ticket) return;

    // Update status if dropped in a different column
    if (destination.droppableId !== ticket.status) {
      const updatedTickets = boardTickets.map((t) =>
        t.id === draggableId
          ? { ...t, status: destination.droppableId as Ticket["status"] }
          : t
      );

      setBoardTickets(updatedTickets);

      // Call backend API to update status
      fetch(`/api/tickets/${draggableId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: destination.droppableId }),
      });
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-6">
        {columns.map((col) => (
          <Droppable droppableId={col} key={col}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex-1 bg-gray-100 p-4 rounded min-h-[300px]"
              >
                <h3 className="font-semibold mb-4">{col.replace("_", " ")}</h3>

                {boardTickets
                  .filter((t) => t.status === col)
                  .map((ticket, index) => (
                    <Draggable
                      draggableId={ticket.id}
                      index={index}
                      key={ticket.id}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white p-3 rounded shadow mb-3 cursor-move"
                        >
                          {ticket.title}
                        </div>
                      )}
                    </Draggable>
                  ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
