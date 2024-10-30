import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";

const authPersistConfig = {
  key: "auth",
  storage: AsyncStorage,
  blacklist: ["error", "loading"],
  timeout: 0,
};

const cartPersistConfig = {
  key: "cart",
  storage: AsyncStorage,
  timeout: 0,
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  cart: persistReducer(cartPersistConfig, cartReducer),
});

export default rootReducer;
