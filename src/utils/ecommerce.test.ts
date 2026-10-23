import test from 'node:test';
import assert from 'node:assert/strict';
import { formatGHS, parseGHS } from './currency';
import {
  calculateLineTotal,
  calculateSubtotal,
  calculateShipping,
  calculateOrderTotal,
  FREE_SHIPPING_THRESHOLD_GHS,
} from './cart';
import { validateEmail, validateGhanaPhone, validatePassword } from './validation';
import { getStockStatus, filterProducts } from './inventory';

test('formatGHS accurately formats numbers into Ghana Cedi representations', () => {
  const formatted = formatGHS(1250);
  assert.ok(formatted.includes('1,250.00'), 'Should contain formatted number with thousands separator');
  assert.ok(formatted.includes('GH') || formatted.includes('₵'), 'Should contain Cedi symbol');
  
  assert.equal(formatGHS(0), 'GH₵ 0.00');
  assert.equal(parseGHS('GH₵ 1,450.50'), 1450.5);
});

test('cart calculations compute line totals and subtotals accurately', () => {
  assert.equal(calculateLineTotal(450, 3), 1350);
  assert.equal(calculateLineTotal(0, 5), 0);

  const items = [
    { price: 850, quantity: 2 }, // 1700
    { price: 1200, quantity: 1 }, // 1200
  ];
  const subtotal = calculateSubtotal(items);
  assert.equal(subtotal, 2900);
});

test('shipping rules apply free shipping thresholds for Greater Accra', () => {
  // Above 1500 in Accra -> free shipping
  const freeAccra = calculateShipping(FREE_SHIPPING_THRESHOLD_GHS + 100, 'Greater Accra', false);
  assert.equal(freeAccra, 0);

  // Below 1500 in Accra -> standard fee 50
  const standardAccra = calculateShipping(600, 'Greater Accra', false);
  assert.equal(standardAccra, 50);

  // Regional delivery (Kumasi / Ashanti) -> 90
  const regional = calculateShipping(2000, 'Ashanti Region', false);
  assert.equal(regional, 90);

  // Express delivery -> 90
  const express = calculateShipping(2000, 'Greater Accra', true);
  assert.equal(express, 90);

  // Total calculation
  assert.equal(calculateOrderTotal(2900, 0, 100), 2800);
});

test('validation functions validate email, ghana phone numbers, and password rules', () => {
  // Email
  assert.equal(validateEmail('customer@zaanisung.com'), true);
  assert.equal(validateEmail('invalid-email'), false);
  assert.equal(validateEmail(''), false);

  // Ghana Phone
  assert.equal(validateGhanaPhone('0244123456'), true);
  assert.equal(validateGhanaPhone('0551234567'), true);
  assert.equal(validateGhanaPhone('+233244123456'), true);
  assert.equal(validateGhanaPhone('12345'), false);
  assert.equal(validateGhanaPhone('0123456789'), false);

  // Password
  const weak = validatePassword('short');
  assert.equal(weak.isValid, false);
  assert.ok(weak.errors.length > 0);

  const strong = validatePassword('Zaanisung2026');
  assert.equal(strong.isValid, true);
  assert.equal(strong.errors.length, 0);
});

test('inventory status and product filtering work reliably', () => {
  assert.equal(getStockStatus(0), 'out_of_stock');
  assert.equal(getStockStatus(4), 'low_stock');
  assert.equal(getStockStatus(15), 'in_stock');

  const sampleProducts = [
    {
      id: 'p1',
      name: 'Oud Royale',
      brand: 'ZAANISUNG',
      family: 'Woody & Oriental',
      price: 1850,
      stock: 12,
      notes: { top: ['Bergamot'], heart: ['Saffron'], base: ['Cambodian Oud'] },
    },
    {
      id: 'p2',
      name: 'Ashanti Amber',
      brand: 'ZAANISUNG',
      family: 'Amber & Warm',
      price: 1200,
      stock: 3,
      notes: { top: ['Mandarin'], heart: ['Cocoa'], base: ['Ambergris'] },
    },
    {
      id: 'p3',
      name: 'Coastal Vetiver',
      brand: 'ZAANISUNG',
      family: 'Fresh & Citrus',
      price: 950,
      stock: 0,
      notes: { top: ['Sea Salt'], heart: ['Vetiver'], base: ['Cedar'] },
    },
  ];

  // Filter by family
  const oriental = filterProducts(sampleProducts, { family: 'Woody & Oriental' });
  assert.equal(oriental.length, 1);
  assert.equal(oriental[0].name, 'Oud Royale');

  // Filter only in stock
  const inStock = filterProducts(sampleProducts, { onlyInStock: true });
  assert.equal(inStock.length, 2);

  // Search by note (e.g. Cocoa)
  const cocoa = filterProducts(sampleProducts, { searchQuery: 'cocoa' });
  assert.equal(cocoa.length, 1);
  assert.equal(cocoa[0].name, 'Ashanti Amber');

  // Price sorting
  const sorted = filterProducts(sampleProducts, { sortBy: 'price-asc' });
  assert.equal(sorted[0].price, 950);
  assert.equal(sorted[2].price, 1850);
});
