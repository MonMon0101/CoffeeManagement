import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    carts: [],
  },
  reducers: {
    addCart: (state, { payload }) => {
      console.log("====================================");
      console.log(`payload`, payload);
      console.log("====================================");

      // Find index item in cart
      const prevCarts = [...state.carts];

      const index = prevCarts.findIndex((t) => t?.id === payload?.id);

      if (index === -1) {
        prevCarts.push({ ...payload, quantity: 1 });
      } else {
        prevCarts[index] = {
          ...prevCarts[index],
          quantity: Math.min(prevCarts[index]?.quantity + 1, 5),
        };
      }

      state.carts = prevCarts;
    },
    minusCart: (state, { payload }) => {
      // Find index item in cart
      let prevCarts = [...state.carts];

      const index = prevCarts.findIndex((t) => t?.id === payload?.id);

      if (index === -1) return;

      const quantity = prevCarts[index]?.quantity - 1;

      prevCarts[index] = {
        ...prevCarts[index],
        quantity: Math.max(0, quantity),
      };

      if (quantity <= 0) {
        prevCarts = prevCarts.filter((t) => t?.id !== payload?.id);
      }

      state.carts = prevCarts;
    },

    resetCart: (state) => {
      state.carts = [];
    },
  },
});

export const cartActions = cartSlice.actions;
export const useCart = () => useSelector((state) => state.cart);
export default cartSlice.reducer;
