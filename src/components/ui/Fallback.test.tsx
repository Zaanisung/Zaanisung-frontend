import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ErrorFallback } from "./Fallback";

describe("ErrorFallback", () => {
  it("renders the default title and hint", () => {
    render(<ErrorFallback />);
    expect(screen.getByRole("heading", { name: "Something went wrong" })).toBeInTheDocument();
    expect(screen.getByText("Please try again in a moment.")).toBeInTheDocument();
  });

  it("renders custom title and hint", () => {
    render(<ErrorFallback title="Custom title" hint="Custom hint" />);
    expect(screen.getByRole("heading", { name: "Custom title" })).toBeInTheDocument();
    expect(screen.getByText("Custom hint")).toBeInTheDocument();
  });

  it("fires onRetry when the Try again button is clicked", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<ErrorFallback onRetry={onRetry} />);
    await user.click(screen.getByRole("button", { name: /try again/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("does not render a retry button when onRetry is undefined", () => {
    render(<ErrorFallback />);
    expect(screen.queryByRole("button", { name: /try again/i })).not.toBeInTheDocument();
  });
});
