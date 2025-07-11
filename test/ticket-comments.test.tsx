import { TicketComments } from "@/components/ticket-comments";
import { render, screen } from "@testing-library/react";

const comments = [
  {
    id: "1",
    content: "This is a test comment",
    createdAt: new Date().toISOString(),
    author: { name: "Alice" },
  },
];

describe("TicketComments", () => {
  it("renders comments", () => {
    render(<TicketComments ticketId="1" comments={comments} />);
    expect(screen.getByText("This is a test comment")).toBeInTheDocument();
    expect(screen.getByText(/alice/i)).toBeInTheDocument();
  });
});
