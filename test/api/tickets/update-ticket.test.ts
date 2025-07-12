import * as handler from "@/app/api/tickets/[id]/route";
import prisma from "@/lib/prisma";
import { vi, describe, it, expect, Mock } from "vitest";

beforeEach(() => {
  vi.clearAllMocks();
});

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
    (prisma.ticket.findUnique as Mock).mockResolvedValue({
      id: "123",
      project: { ownerId: "user-1" },
    });

    (prisma.ticket.update as Mock).mockResolvedValue({
      id: "123",
      status: "IN_PROGRESS",
    });

    const mockReq = createMockRequest({ status: "IN_PROGRESS" });
    const params = { params: { id: "123" } };

    const res = await handler.PATCH(mockReq, params);

    expect(prisma.ticket.update).toHaveBeenCalledWith({
      where: { id: "123" },
      data: { status: "IN_PROGRESS" },
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual({ ok: true });
  });

  it("returns 403 if user does not own the ticket's project", async () => {
    const mockReq = createMockRequest({ status: "DONE" });
    const params = { params: { id: "not-owned-id" } };

    (prisma.ticket.findUnique as Mock).mockResolvedValue({
      id: "not-owned-id",
      project: {
        ownerId: "someone-else",
      },
    });

    const res = await handler.PATCH(mockReq, params);

    expect(res.status).toBe(403);
    const data = await res.json();
    expect(data).toEqual({ error: "Forbidden" });

    expect(prisma.ticket.update).not.toHaveBeenCalled();
  });

  it("returns 401 if user is not authenticated", async () => {
    const { getServerSession } = await import("next-auth");
    (getServerSession as Mock).mockResolvedValue(null);

    const mockReq = createMockRequest({ status: "DONE" });
    const params = { params: { id: "123" } };

    const res = await handler.PATCH(mockReq, params);

    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data).toEqual({ error: "Unauthorized" });

    expect(prisma.ticket.findUnique).not.toHaveBeenCalled();
    expect(prisma.ticket.update).not.toHaveBeenCalled();
  });

  it("returns 400 if request body is empty", async () => {
    const { getServerSession } = await import("next-auth");
    (getServerSession as Mock).mockResolvedValue({
      user: {
        id: "user-1",
      },
    });
    const mockReq = createMockRequest({});
    const params = { params: { id: "123" } };

    (prisma.ticket.findUnique as Mock).mockResolvedValue({
      id: "123",
      project: {
        ownerId: "user-1",
      },
    });

    const res = await handler.PATCH(mockReq, params);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data).toEqual({ error: "Invalid data" });

    expect(prisma.ticket.update).not.toHaveBeenCalled();
  });
});
