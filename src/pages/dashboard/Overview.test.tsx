import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { FullUser } from "../../types/user";
import { Overview } from "./Overview";

const baseProps = {
  user: null,
  orders: [],
  products: [],
  isLoadingProducts: false,
  isLoadingOrders: false,
  onNavigate: vi.fn(),
  onSelectProduct: vi.fn(),
  onAddToCart: vi.fn(),
};

describe("dashboard Overview", () => {
  it("renders the greeting without crashing when the user has no name", () => {
    // Regresses: `Cannot read properties of undefined (reading 'split')` in the
    // dashboard hello line for name-less accounts.
    const user = {
      id: "u1",
      name: undefined as unknown as string,
      role: "CUSTOMER",
      isEmailVerified: false,
      isPhoneVerified: false,
      passwordMustChange: false,
      addresses: [],
      paymentMethods: [],
    } as FullUser;
    render(<Overview {...baseProps} user={user} />);
    expect(screen.getByText(/^Hello$/)).toBeInTheDocument();
    expect(screen.getByText("No orders yet. Start shopping to see your orders here.")).toBeInTheDocument();
  });

  it("greets the user by first name when one exists", () => {
    const user = {
      id: "u2",
      name: "Abena Serwaa",
      role: "CUSTOMER",
      isEmailVerified: false,
      isPhoneVerified: false,
      passwordMustChange: false,
      addresses: [],
      paymentMethods: [],
    } as FullUser;
    render(<Overview {...baseProps} user={user} />);
    expect(screen.getByText(/Hello, Abena/)).toBeInTheDocument();
  });

  it("renders the anonymous state when no user is signed in", () => {
    render(<Overview {...baseProps} />);
    expect(screen.getByText(/^Hello$/)).toBeInTheDocument();
  });
});