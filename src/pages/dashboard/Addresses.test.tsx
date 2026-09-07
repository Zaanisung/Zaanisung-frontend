import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { Address } from "../../types/user";
import { Addresses } from "./Addresses";

const baseProps = {
  onAddAddress: vi.fn(),
  onUpdateAddress: vi.fn(),
  onDeleteAddress: vi.fn(),
  onSetDefaultAddress: vi.fn(),
};

const addresses: Address[] = [
  {
    _id: "a1",
    label: "Home",
    recipientName: "Ada Mensah",
    phone: "0244000001",
    streetAddress: "12 Kwame Nkrumah Ave",
    city: "Accra",
    region: "Greater Accra",
    digitalAddress: "GA-123-4567",
    isDefault: true,
  },
  {
    _id: "a2",
    label: "Office",
    recipientName: "Kofi Boateng",
    phone: "0244000002",
    streetAddress: "8 Oxford Street",
    city: "Osu",
    region: "Greater Accra",
    isDefault: false,
  },
];

describe("Addresses", () => {
  it("renders each address's recipient name, phone and city", () => {
    render(<Addresses {...baseProps} addresses={addresses} />);
    expect(screen.getByText("Ada Mensah")).toBeInTheDocument();
    expect(screen.getByText("0244000001")).toBeInTheDocument();
    expect(
      screen.getByText("12 Kwame Nkrumah Ave, Accra, Greater Accra")
    ).toBeInTheDocument();
    expect(screen.getByText("Kofi Boateng")).toBeInTheDocument();
    expect(screen.getByText("0244000002")).toBeInTheDocument();
    expect(screen.getByText("8 Oxford Street, Osu, Greater Accra")).toBeInTheDocument();
  });

  it("renders a Default badge for the default address only", () => {
    render(<Addresses {...baseProps} addresses={addresses} />);
    expect(screen.getAllByText("Default")).toHaveLength(1);
  });

  it("shows the empty state message when addresses is empty", () => {
    render(<Addresses {...baseProps} addresses={[]} />);
    expect(screen.getByText("No saved addresses")).toBeInTheDocument();
    expect(
      screen.getByText("Add a delivery address so checkout is faster next time.")
    ).toBeInTheDocument();
  });

  it("calls onAddAddress with the entered data on submit", async () => {
    const user = userEvent.setup();
    const onAddAddress = vi.fn();
    render(<Addresses {...baseProps} onAddAddress={onAddAddress} addresses={[]} />);

    await user.click(screen.getByRole("button", { name: /add your first address/i }));

    const textboxes = screen.getAllByRole("textbox");
    await user.type(textboxes[0], "Home");
    await user.type(textboxes[1], "Ada Mensah");
    await user.type(textboxes[2], "0244000001");
    await user.type(textboxes[3], "Accra");
    await user.type(textboxes[4], "Greater Accra");
    await user.type(textboxes[5], "GA-123-4567");
    await user.type(textboxes[6], "12 Kwame Nkrumah Ave");

    await user.click(screen.getByRole("button", { name: /add address/i }));

    expect(onAddAddress).toHaveBeenCalledTimes(1);
    expect(onAddAddress).toHaveBeenCalledWith({
      label: "Home",
      recipientName: "Ada Mensah",
      phone: "0244000001",
      streetAddress: "12 Kwame Nkrumah Ave",
      city: "Accra",
      region: "Greater Accra",
      digitalAddress: "GA-123-4567",
      isDefault: true,
    });
  });
});
