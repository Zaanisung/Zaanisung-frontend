export type Product = {
  _id: string;
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl: string;
  stock: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};