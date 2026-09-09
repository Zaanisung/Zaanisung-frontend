import React, { useState, useRef } from "react";
import { Product } from "../../types";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { ArrowLeft, Upload, Image as ImageIcon } from "lucide-react";
import { compressImage } from "../../utils/image";

export interface AddProductProps {
  onBack: () => void;
  onSave: (product: Omit<Product, "_id" | "id" | "isActive">) => void;
}

export const AddProduct: React.FC<AddProductProps> = ({ onBack, onSave }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState(
    "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80"
  );
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const dataUrl = await compressImage(file);
        setImageUrl(dataUrl);
      } catch {
        const reader = new FileReader();
        reader.onload = (loadEvt) => {
          if (typeof loadEvt.target?.result === "string") {
            setImageUrl(loadEvt.target.result);
          }
        };
        reader.readAsDataURL(file);
      }
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
      description: description.trim() || undefined,
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
        className="min-h-[44px] inline-flex items-center text-xs uppercase tracking-widest text-black/45 dark:text-white/45 hover:text-black dark:hover:text-white font-semibold mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Inventory
      </button>

      <div className="relative overflow-hidden surface-glass-strong p-6 sm:p-8 shadow-lift rounded-2xl">
        <div className="absolute top-0 left-0 right-0 hairline-gold"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 orb orb-gold-faint" aria-hidden="true"></div>

        <div className="relative pb-2 mb-6">
          <h2
            className="text-xl sm:text-2xl font-light text-black dark:text-white font-brand-serif"
          >
            Add New Fragrance
          </h2>
          <p className="text-xs uppercase tracking-widest text-black/45 dark:text-white/45 mt-1">
            Short inventory intake form
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/50 border border-red-800 text-xs text-red-300 font-medium mb-6 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Image Upload / Preview */}
          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-black/45 dark:text-white/45 block">
              Perfume Image
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-24 surface-glass-tint border-gold/30 overflow-hidden flex items-center justify-center flex-shrink-0">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-6 h-6 text-black/60 dark:text-white/60" />
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
                  className="min-h-[44px] px-4 py-2 text-xs uppercase tracking-wider font-semibold text-gold bg-gold/10 hover:bg-gold/20 border border-gold/40 flex items-center space-x-2 transition-colors rounded-lg"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Image File</span>
                </button>
                <p className="text-[10px] text-black/50 dark:text-white/50">
                  Or paste an image link below:
                </p>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-1.5 text-xs surface-glass text-black/60 dark:text-white/60 focus:outline-none focus:border-gold"
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

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-black/60 dark:text-white/60 block">
              Short Description
              <span className="normal-case font-normal text-black/50 dark:text-white/50 ml-2">
                ({description.length}/160 · optional)
              </span>
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 160))}
              placeholder="e.g. A bold amber-oud blend with a warm, smoky dry-down."
              className="w-full min-h-[44px] px-3.5 py-2.5 text-sm bg-white dark:bg-white/5 text-black dark:text-white placeholder-black/40 rounded-xl border border-black/10 dark:border-white/15 transition-colors focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
            />
            <p className="text-[10px] text-black/50 dark:text-white/50">One line shown on product cards and the landing page.</p>
          </div>

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
          <div className="pt-5 flex space-x-3">
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
              className="border-black/10 dark:border-white/15 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
