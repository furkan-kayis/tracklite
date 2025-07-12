import * as handler from "@/app/api/tickets/[id]/route";
import prisma from "@/lib/prisma";
import { vi, describe, it, expect, Mock } from "vitest";

vi.mock("@/lib/prisma", () => ({
  default: {
    ticket: {
      findUnique: vi.fn(() =>
        Promise.resolve({
          id: "123",
          project: {
            ownerId: "user-1",
          },
        })
      ),
      update: vi.fn(() =>
        Promise.resolve({
          id: "123",
          status: "IN_PROGRESS",
        })
      ),
    },
  },
}));

vi.mock("next-auth", () => ({
  getServerSession: vi.fn(() =>
    Promise.resolve({
      user: {
        id: "user-1",
      },
    })
  ),
}));

function createMockRequest(body: unknown): Request {
  return {
    json: async () => body,
  } as unknown as Request;
}

describe("PATCH /api/tickets/[id]", () => {
  it("updates ticket status and returns ok", async () => {
    // Arrange: setup findUnique to return a ticket owned by user-1
    (prisma.ticket.findUnique as Mock).mockResolvedValue({
      id: "123",
      project: { ownerId: "user-1" },
    });

    // Arrange: setup update to return the updated ticket
    (prisma.ticket.update as Mock).mockResolvedValue({
      id: "123",
      status: "IN_PROGRESS",
    });

    const mockReq = createMockRequest({ status: "IN_PROGRESS" });
    const params = { params: { id: "123" } };

    // Act
    const res = await handler.PATCH(mockReq, params);

    // Assert prisma update was called with correct params
    expect(prisma.ticket.update).toHaveBeenCalledWith({
      where: { id: "123" },
      data: { status: "IN_PROGRESS" },
    });

    // Assert response status and body
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual({ ok: true });
  });
});
