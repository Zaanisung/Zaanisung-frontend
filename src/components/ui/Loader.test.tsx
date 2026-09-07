import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Loader, PageLoader } from "./Loader";

describe("Loader", () => {
  it.each(["dots", "squares", "circles"] as const)(
    "renders role=status and aria-label=Loading for the %s variant",
    (variant) => {
      render(<Loader variant={variant} />);
      const status = screen.getByRole("status");
      expect(status).toHaveAttribute("aria-label", "Loading");
    }
  );

  it("applies the size class", () => {
    render(<Loader size="sm" />);
    const status = screen.getByRole("status");
    expect(status.className).toContain("gap-1.5");
  });

  it("uses the matching gap/size classes for each size", () => {
    const { rerender } = render(<Loader size="sm" />);
    expect(screen.getByRole("status").className).toContain("gap-1.5");

    rerender(<Loader size="md" />);
    expect(screen.getByRole("status").className).toContain("gap-2");

    rerender(<Loader size="lg" />);
    expect(screen.getByRole("status").className).toContain("gap-2.5");
  });

  it("renders no text content", () => {
    render(<Loader />);
    const status = screen.getByRole("status");
    expect(status.textContent?.trim()).toBe("");
  });
});

describe("PageLoader", () => {
  it("renders a role=status wrapper with the loader inside", () => {
    render(<PageLoader />);
    expect(screen.getAllByRole("status").length).toBeGreaterThan(0);
  });
});
