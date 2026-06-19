'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Client-side cart (guest-friendly, spec §11). Persisted to localStorage so a
 * shopper can check out as a guest without an account. Logged-in users could
 * later sync this to the server cart endpoints.
 */
export const useCart = create(
  persist(
    (set, get) => ({
      items: [], // { productId, slug, title, price, thumbnail, stock, quantity }

      add(product, quantity = 1) {
        const items = [...get().items];
        const idx = items.findIndex((i) => i.productId === product.productId);
        if (idx >= 0) {
          items[idx] = { ...items[idx], quantity: Math.min(items[idx].quantity + quantity, product.stock) };
        } else {
          items.push({ ...product, quantity: Math.min(quantity, product.stock) });
        }
        set({ items });
      },

      setQuantity(productId, quantity) {
        const items = get()
          .items.map((i) => (i.productId === productId ? { ...i, quantity } : i))
          .filter((i) => i.quantity > 0);
        set({ items });
      },

      remove(productId) {
        set({ items: get().items.filter((i) => i.productId !== productId) });
      },

      clear() {
        set({ items: [] });
      },

      subtotal() {
        return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      },

      count() {
        return get().items.reduce((n, i) => n + i.quantity, 0);
      },
    }),
    { name: 'velourax-cart' }
  )
);
