// store.js
import { create } from 'zustand';

const useCartStore = create((set, get) => ({
  cart: {}, // Initial cart is empty
  products: [],
  setProducts: (newProducts) => set({ products: newProducts }),
  updateQuantity: (productId, quantity) =>
    set((state) => ({
      cart: { ...state.cart, [productId]: quantity },
    })),
  totalItemsInCart: () => Object.values(get().cart).reduce((sum, qty) => sum + qty, 0),
  clearCart: () => set({ cart: {} }),
}));

export default useCartStore;