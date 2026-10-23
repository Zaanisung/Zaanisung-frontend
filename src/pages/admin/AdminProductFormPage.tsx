import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { FragranceFamily, Product } from '../../types';
import { ArrowLeft, Save } from 'lucide-react';

export const AdminProductFormPage: React.FC = () => {
  const { currentRoute, routeParams, products, addProduct, updateProduct, navigateTo } = useApp();

  const isEdit = currentRoute === 'admin-product-edit';
  const existingProduct = isEdit ? products.find((p) => p.id === routeParams.productId) : null;

  // Form Fields
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [brand, setBrand] = useState('ZAANISUNG');
  const [family, setFamily] = useState<FragranceFamily>('Woody & Oriental');
  const [concentration, setConcentration] = useState<'Extrait de Parfum' | 'Eau de Parfum'>('Extrait de Parfum');
  const [price, setPrice] = useState('2450');
  const [stock50, setStock50] = useState('10');
  const [stock100, setStock100] = useState('15');
  const [stock200, setStock200] = useState('5');
  const [topNotes, setTopNotes] = useState('Calabrian Bergamot, Saffron');
  const [heartNotes, setHeartNotes] = useState('Taif Rose, Cistus Labdanum');
  const [baseNotes, setBaseNotes] = useState('Cambodian Oud, Ambergris');
  const [description, setDescription] = useState('');
  const [story, setStory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (existingProduct) {
      setName(existingProduct.name);
      setSubtitle(existingProduct.subtitle);
      setBrand(existingProduct.brand);
      setFamily(existingProduct.family);
      setConcentration(existingProduct.concentration);
      setPrice(existingProduct.price.toString());
      setStock50(existingProduct.sizes.find((s) => s.size === '50ml')?.stock.toString() || '0');
      setStock100(existingProduct.sizes.find((s) => s.size === '100ml')?.stock.toString() || '0');
      setStock200(existingProduct.sizes.find((s) => s.size === '200ml')?.stock.toString() || '0');
      setTopNotes(existingProduct.notes.top.join(', '));
      setHeartNotes(existingProduct.notes.heart.join(', '));
      setBaseNotes(existingProduct.notes.base.join(', '));
      setDescription(existingProduct.description);
      setStory(existingProduct.story || '');
      setImageUrl(existingProduct.image);
      setIsFeatured(!!existingProduct.isFeatured);
      setIsBestSeller(!!existingProduct.isBestSeller);
    }
  }, [existingProduct]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Perfume name is required';
    if (!price || isNaN(Number(price))) errs.price = 'Valid base price in GHS is required';
    if (!description.trim()) errs.description = 'Description is required';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const basePriceNum = Number(price);
    const s50 = parseInt(stock50, 10) || 0;
    const s100 = parseInt(stock100, 10) || 0;
    const s200 = parseInt(stock200, 10) || 0;
    const totalStock = s50 + s100 + s200;

    const productPayload: Omit<Product, 'id'> = {
      name,
      subtitle: subtitle || 'Artisanal Extrait de Parfum',
      brand: brand || 'ZAANISUNG',
      family,
      concentration,
      price: basePriceNum,
      sizes: [
        { size: '50ml', price: Math.round(basePriceNum * 0.72), stock: s50 },
        { size: '100ml', price: basePriceNum, stock: s100 },
        { size: '200ml', price: Math.round(basePriceNum * 1.55), stock: s200 },
      ],
      stock: totalStock,
      description,
      story,
      notes: {
        top: topNotes.split(',').map((s) => s.trim()).filter(Boolean),
        heart: heartNotes.split(',').map((s) => s.trim()).filter(Boolean),
        base: baseNotes.split(',').map((s) => s.trim()).filter(Boolean),
      },
      image: imageUrl || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
      isFeatured,
      isBestSeller,
      origin: 'Accra',
    };

    if (isEdit && existingProduct) {
      updateProduct(existingProduct.id, productPayload);
    } else {
      addProduct(productPayload);
    }

    navigateTo('admin-products');
  };

  return (
    <div className="flex-1 min-h-screen bg-[#FAF8F4] flex flex-col text-left">
      <AdminHeader
        title={isEdit ? `Edit Formulation: ${existingProduct?.name}` : 'Register New Perfume Formulation'}
        subtitle="Catalog and batch specification for ZAANISUNG inventory"
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateTo('admin-products')}
            leftIcon={<ArrowLeft size={13} />}
          >
            Back to Inventory
          </Button>
        }
      />

      <div className="p-6 sm:p-8 max-w-4xl">
        <form onSubmit={handleSubmit} className="bg-[#FFFFFF] border border-[#E4DED3] p-6 sm:p-8 rounded-xs shadow-xs space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Flacon / Perfume Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
              placeholder="e.g. Oud Royale"
              required
            />
            <Input
              label="Subtitle / Headline Accord"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. Smoked Agarwood & Taif Rose"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Fragrance Family"
              value={family}
              onChange={(e) => setFamily(e.target.value as any)}
              options={[
                { value: 'Woody & Oriental', label: 'Woody & Oriental' },
                { value: 'Amber & Warm', label: 'Amber & Warm' },
                { value: 'Fresh & Citrus', label: 'Fresh & Citrus' },
                { value: 'Floral & Delicate', label: 'Floral & Delicate' },
                { value: 'Gourmand & Spice', label: 'Gourmand & Spice' },
              ]}
            />
            <Select
              label="Concentration"
              value={concentration}
              onChange={(e) => setConcentration(e.target.value as any)}
              options={[
                { value: 'Extrait de Parfum', label: 'Extrait de Parfum (25-30%)' },
                { value: 'Eau de Parfum', label: 'Eau de Parfum (18-22%)' },
              ]}
            />
            <Input
              label="Base Price in Ghanaian Cedis (100ml)"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              error={errors.price}
              placeholder="2450"
              required
            />
          </div>

          {/* Volume Allocation Stock Breakdown */}
          <div className="p-4 bg-[#FAF8F4] border border-[#E4DED3] rounded-xs space-y-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#716C64] block">
              Physical Stock Allocations (Units)
            </span>
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="50ml Flacons"
                type="number"
                value={stock50}
                onChange={(e) => setStock50(e.target.value)}
              />
              <Input
                label="100ml Flacons"
                type="number"
                value={stock100}
                onChange={(e) => setStock100(e.target.value)}
              />
              <Input
                label="200ml Flacons"
                type="number"
                value={stock200}
                onChange={(e) => setStock200(e.target.value)}
              />
            </div>
          </div>

          {/* Olfactory Notes */}
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#716C64] block">
              Olfactory Pyramid (Comma-separated notes)
            </span>
            <Input
              label="Top Notes"
              value={topNotes}
              onChange={(e) => setTopNotes(e.target.value)}
              placeholder="Bergamot, Saffron, Pink Pepper"
            />
            <Input
              label="Heart Notes"
              value={heartNotes}
              onChange={(e) => setHeartNotes(e.target.value)}
              placeholder="Taif Rose, Cistus Labdanum, Patchouli"
            />
            <Input
              label="Base Notes"
              value={baseNotes}
              onChange={(e) => setBaseNotes(e.target.value)}
              placeholder="Cambodian Oud, Royal Ambergris, Leather"
            />
          </div>

          {/* Descriptions */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-medium text-[#716C64] mb-1.5">
                Boutique Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A sovereign composition centered around..."
                className="w-full bg-[#FFFFFF] text-[#171512] px-3.5 py-2.5 text-sm border border-[#E4DED3] rounded-xs focus:border-[#171512] outline-none"
                required
              />
              {errors.description && <p className="text-xs text-red-800 mt-1">{errors.description}</p>}
            </div>

            <Input
              label="Atelier Quote / Craftsmanship Story"
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="e.g. Crafted as an homage to the ancient resins of..."
            />

            <Input
              label="Product Image URL (or Leave blank for default asset placeholder)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs text-[#171512] cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 text-[#B69A59]"
              />
              <span>Display on Storefront Homepage (Featured)</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-[#171512] cursor-pointer">
              <input
                type="checkbox"
                checked={isBestSeller}
                onChange={(e) => setIsBestSeller(e.target.checked)}
                className="w-4 h-4 text-[#B69A59]"
              />
              <span>Mark as Best Seller</span>
            </label>
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-[#E4DED3] flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => navigateTo('admin-products')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              leftIcon={<Save size={15} />}
            >
              {isEdit ? 'Save Changes' : 'Publish to Boutique'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
