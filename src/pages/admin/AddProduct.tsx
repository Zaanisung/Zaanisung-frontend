import React, { useState, useRef } from "react";
import { Product } from "../../types";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { ArrowLeft, Upload, Image as ImageIcon } from "lucide-react";

export interface AddProductProps {
  onBack: () => void;
  onSave: (product: Omit<Product, "_id" | "id" | "isActive">) => void;
}

export const AddProduct: React.FC<AddProductProps> = ({ onBack, onSave }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState(
    "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80"
  );
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        if (typeof loadEvt.target?.result === "string") {
          setImageUrl(loadEvt.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter a perfume name.");
      return;
    }
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      setError("Please enter a valid price in GHS.");
      return;
    }
    const numStock = parseInt(stock, 10);
    if (isNaN(numStock) || numStock < 0) {
      setError("Please enter a valid stock count.");
      return;
    }

    onSave({
      name: name.trim(),
      price: numPrice,
      stock: numStock,
      imageUrl: imageUrl.trim() || "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80",
    });
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <button
        type="button"
        onClick={onBack}
        className="min-h-[44px] inline-flex items-center text-xs uppercase tracking-widest text-gray-400 hover:text-white font-semibold mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Inventory
      </button>

      <div className="bg-[#121216] border border-[#1E1E24] p-6 sm:p-8">
        <div className="border-b border-[#1E1E24] pb-4 mb-6">
          <h2
            className="text-xl sm:text-2xl font-light text-white"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Add New Fragrance
          </h2>
          <p className="text-xs uppercase tracking-widest text-gray-400 mt-1">
            Short inventory intake form
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/50 border border-red-800 text-xs text-red-300 font-medium mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Image Upload / Preview */}
          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 block">
              Perfume Image
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-24 bg-[#181820] border border-[#2B2B38] overflow-hidden flex items-center justify-center flex-shrink-0">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-6 h-6 text-gray-600" />
                )}
              </div>

              <div className="flex-1 space-y-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="min-h-[44px] px-4 py-2 text-xs uppercase tracking-wider font-semibold bg-[#1C1C24] hover:bg-[#282834] text-white border border-[#30303E] flex items-center space-x-2 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Image File</span>
                </button>
                <p className="text-[10px] text-gray-500">
                  Or paste an image link below:
                </p>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-1.5 text-xs bg-[#0A0A0E] border border-[#262632] text-gray-300 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>
          </div>

          {/* Name */}
          <Input
            label="Fragrance Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Amber Oud Noir"
            required
          />

          {/* Price & Stock in 2 cols */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Price (GHS)"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="480.00"
              required
            />

            <Input
              label="Stock Quantity"
              type="number"
              step="1"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="15"
              required
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-[#1E1E24] flex space-x-3">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="flex-1 font-bold"
            >
              Save Perfume
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={onBack}
              className="border-[#2D2D38] text-gray-300 hover:text-white"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
