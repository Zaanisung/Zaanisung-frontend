import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { AppNotification } from "../../types/user";
import { Notifications } from "./Notifications";

const notifications: AppNotification[] = [
  {
    _id: "n1",
    channel: "IN_APP",
    type: "ORDER_CONFIRMED",
    title: "Order confirmed",
    body: "Your order #1234 was confirmed.",
    status: "SENT",
    createdAt: new Date().toISOString(),
    readAt: undefined,
  },
  {
    _id: "n2",
    channel: "EMAIL",
    type: "PROMOTION",
    title: "Weekend sale",
    body: "Get 20% off everything this weekend.",
    status: "SENT",
    createdAt: new Date().toISOString(),
    readAt: "2026-09-01T10:00:00.000Z",
  },
];

describe("Notifications", () => {
  it("renders notification titles and bodies", () => {
    render(
      <Notifications
        notifications={notifications}
        onMarkRead={vi.fn()}
        onMarkAllRead={vi.fn()}
      />
    );
    expect(screen.getByText("Order confirmed")).toBeInTheDocument();
    expect(screen.getByText("Your order #1234 was confirmed.")).toBeInTheDocument();
    expect(screen.getByText("Weekend sale")).toBeInTheDocument();
    expect(screen.getByText("Get 20% off everything this weekend.")).toBeInTheDocument();
  });

  it("calls onMarkRead with the id when an unread notification is clicked", async () => {
    const user = userEvent.setup();
    const onMarkRead = vi.fn();
    render(
      <Notifications
        notifications={notifications}
        onMarkRead={onMarkRead}
        onMarkAllRead={vi.fn()}
      />
    );
    await user.click(screen.getByRole("button", { name: /order confirmed/i }));
    expect(onMarkRead).toHaveBeenCalledWith("n1");
  });

  it("calls onMarkAllRead when the mark all read button is clicked", async () => {
    const user = userEvent.setup();
    const onMarkAllRead = vi.fn();
    render(
      <Notifications
        notifications={notifications}
        onMarkRead={vi.fn()}
        onMarkAllRead={onMarkAllRead}
      />
    );
    await user.click(screen.getByRole("button", { name: /mark all read/i }));
    expect(onMarkAllRead).toHaveBeenCalledTimes(1);
  });

  it("shows the empty state when notifications is empty", () => {
    render(
      <Notifications
        notifications={[]}
        onMarkRead={vi.fn()}
        onMarkAllRead={vi.fn()}
      />
    );
    expect(screen.getByText("No notifications")).toBeInTheDocument();
  });
});
