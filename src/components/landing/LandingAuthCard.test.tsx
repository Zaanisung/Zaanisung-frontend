import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { CustomerUser } from "../../types";
import { LandingAuthCard } from "./LandingAuthCard";

const baseProps = {
  mode: "signup" as const,
  showForm: false,
  justCreated: false,
  name: "",
  identifier: "",
  password: "",
  error: null,
  isLoading: false,
  onModeChange: vi.fn(),
  onNameChange: vi.fn(),
  onIdentifierChange: vi.fn(),
  onPasswordChange: vi.fn(),
  onSubmit: vi.fn(),
  onStartShopping: vi.fn(),
  onBrowseShop: vi.fn(),
};

describe("LandingAuthCard", () => {
  it("renders the signed-in success panel without crashing when name is missing", () => {
    // Regresses: `Cannot read properties of undefined (reading 'split')` when an
    // account profile surfaced without a name.
    const currentUser = { id: "u1", name: undefined as unknown as string, role: "CUSTOMER" } as CustomerUser;
    render(<LandingAuthCard {...baseProps} isLoggedIn currentUser={currentUser} />);
    expect(screen.getByText(/^Welcome,$/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /continue to dashboard/i })).toBeInTheDocument();
  });

  it("greets the user by first name when one exists", () => {
    const currentUser = { id: "u2", name: "Aisha Mohammed", role: "CUSTOMER" } as CustomerUser;
    render(<LandingAuthCard {...baseProps} isLoggedIn currentUser={currentUser} />);
    expect(screen.getByText(/Welcome, Aisha/)).toBeInTheDocument();
  });

  it("renders the just-created panel without a signed-in user", () => {
    render(<LandingAuthCard {...baseProps} isLoggedIn={false} justCreated currentUser={null} />);
    expect(screen.getByText("You're all set")).toBeInTheDocument();
  });
});