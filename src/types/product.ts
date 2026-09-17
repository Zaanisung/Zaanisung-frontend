export type ImageStandardizationStatus =
  | "none"
  | "processing"
  | "needs_review"
  | "approved"
  | "rejected"
  | "failed";

export type ImageStandardization = {
  status: ImageStandardizationStatus;
  originalImageUrl?: string | null;
  generatedImageUrl?: string | null;
  approvedImageUrl?: string | null;
  requestedImageUrl?: string | null;
  lastError?: string | null;
  updatedAt?: string | null;
};

export type Product = {
  _id: string;
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl: string;
  stock: number;
  isActive: boolean;
  imageStandardization?: ImageStandardization;
  createdAt?: string;
  updatedAt?: string;
};