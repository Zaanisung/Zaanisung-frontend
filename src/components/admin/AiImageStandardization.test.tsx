import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AiImageStandardization } from "./AiImageStandardization";
import {
  getAiImageStatus,
  standardizeImage,
  standardizeProductImage,
  approveProductImage,
  rejectProductImage,
} from "../../services/product.service";

vi.mock("../../services/product.service", () => ({
  getAiImageStatus: vi.fn(),
  standardizeImage: vi.fn(),
  standardizeProductImage: vi.fn(),
  approveProductImage: vi.fn(),
  rejectProductImage: vi.fn(),
}));

const mocks = {
  getAiImageStatus: vi.mocked(getAiImageStatus),
  standardizeImage: vi.mocked(standardizeImage),
  standardizeProductImage: vi.mocked(standardizeProductImage),
  approveProductImage: vi.mocked(approveProductImage),
  rejectProductImage: vi.mocked(rejectProductImage),
};

const CANDIDATE = "data:image/png;base64,candidate";

describe("AiImageStandardization", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getAiImageStatus.mockResolvedValue({ enabled: true });
    mocks.standardizeImage.mockResolvedValue({ imageUrl: CANDIDATE });
    mocks.standardizeProductImage.mockResolvedValue({
      product: {
        imageStandardization: { status: "needs_review", generatedImageUrl: CANDIDATE },
      } as never,
    });
  });

  it("renders nothing when the feature is not configured", async () => {
    mocks.getAiImageStatus.mockResolvedValue({ enabled: false });
    const { container } = render(
      <AiImageStandardization imageUrl="x" onStandardized={vi.fn()} />
    );
    await waitFor(() => expect(container.firstChild).toBeNull());
  });

  it("hides when the status probe fails (fail-safe)", async () => {
    mocks.getAiImageStatus.mockRejectedValue(new Error("probe failed"));
    const { container } = render(
      <AiImageStandardization imageUrl="x" onStandardized={vi.fn()} />
    );
    await waitFor(() => expect(container.firstChild).toBeNull());
  });

  it("disables generation while there is no image", async () => {
    render(<AiImageStandardization onStandardized={vi.fn()} />);
    const button = await screen.findByRole("button", { name: /generate an AI-standardized image/i });
    expect(button).toBeDisabled();
  });

  it("generates, reviews and approves without a product id (add-product flow)", async () => {
    const onStandardized = vi.fn();
    const user = userEvent.setup();
    render(
      <AiImageStandardization
        imageUrl="https://example.com/p.jpg"
        onStandardized={onStandardized}
      />
    );

    await user.click(await screen.findByRole("button", { name: /generate an AI-standardized image/i }));
    await waitFor(() =>
      expect(mocks.standardizeImage).toHaveBeenCalledWith("https://example.com/p.jpg")
    );

    const approve = await screen.findByRole("button", { name: /approve/i });
    expect(screen.getByAltText("AI-standardized candidate")).toBeInTheDocument();
    await user.click(approve);

    expect(onStandardized).toHaveBeenCalledWith(CANDIDATE);
    expect(mocks.approveProductImage).not.toHaveBeenCalled();
    expect(screen.getByText(/approved/i)).toBeInTheDocument();
  });

  it("persists the approval server-side for existing products", async () => {
    mocks.approveProductImage.mockResolvedValue({ product: {} as never });
    const onStandardized = vi.fn();
    const user = userEvent.setup();
    render(
      <AiImageStandardization
        productId="p1"
        imageUrl="https://example.com/p.jpg"
        onStandardized={onStandardized}
      />
    );

    await user.click(await screen.findByRole("button", { name: /generate an AI-standardized image/i }));
    await waitFor(() =>
      expect(mocks.standardizeProductImage).toHaveBeenCalledWith(
        "p1",
        "https://example.com/p.jpg"
      )
    );

    await user.click(await screen.findByRole("button", { name: /approve/i }));
    expect(mocks.approveProductImage).toHaveBeenCalledWith("p1");
    expect(onStandardized).toHaveBeenCalledWith(CANDIDATE);
  });

  it("rejects the candidate and leaves the live image alone", async () => {
    const user = userEvent.setup();
    render(
      <AiImageStandardization
        productId="p1"
        imageUrl="https://example.com/p.jpg"
        onStandardized={vi.fn()}
      />
    );

    await user.click(await screen.findByRole("button", { name: /generate an AI-standardized image/i }));
    await waitFor(() => expect(mocks.standardizeProductImage).toHaveBeenCalled());

    await user.click(await screen.findByRole("button", { name: /reject/i }));
    expect(mocks.rejectProductImage).toHaveBeenCalledWith("p1");
    expect(await screen.findByText(/candidate rejected/i)).toBeInTheDocument();
  });

  it("surfaces safe errors when generation fails", async () => {
    mocks.standardizeImage.mockRejectedValue({
      statusCode: 503,
      message: "AI image standardization is not configured.",
    });
    const user = userEvent.setup();
    render(<AiImageStandardization imageUrl="x" onStandardized={vi.fn()} />);

    await user.click(await screen.findByRole("button", { name: /generate an AI-standardized image/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "AI image standardization is not configured."
    );
  });

  it("resumes a pending candidate when reopening an existing product", async () => {
    render(
      <AiImageStandardization
        productId="p1"
        imageUrl="https://example.com/p.jpg"
        existing={{ status: "needs_review", generatedImageUrl: CANDIDATE }}
        onStandardized={vi.fn()}
      />
    );

    expect(await screen.findByRole("button", { name: /approve/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reject/i })).toBeInTheDocument();
  });
});