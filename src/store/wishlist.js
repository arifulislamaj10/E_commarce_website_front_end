'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Client-side wishlist (guest-friendly), persisted to localStorage — so a
 * shopper can save favourites without an account, just like the cart.
 * Stores a product snapshot so the wishlist page can render cards offline.
 */
export const useWishlist = create(
  persist(
    (set, get) => ({
      items: [], // product snapshots (see toSnapshot in WishlistButton)

      toggle(product) {
        const exists = get().items.some((i) => i.productId === product.productId);
        set({
          items: exists
            ? get().items.filter((i) => i.productId !== product.productId)
            : [product, ...get().items],
        });
      },

      has(productId) {
        return get().items.some((i) => i.productId === productId);
      },

      remove(productId) {
        set({ items: get().items.filter((i) => i.productId !== productId) });
      },

      clear() {
        set({ items: [] });
      },

      count() {
        return get().items.length;
      },
    }),
    { name: 'velourax-wishlist' }
  )
);
