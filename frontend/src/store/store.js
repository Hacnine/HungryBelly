import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./authSlice"
import cartReducer from "./cartSlice"
import menuReducer from "./menuSlice"
import orderReducer from "./orderSlice"
import adminReducer from "./adminSlice"
import { authApi } from "./authApi";
import { foodItemsApi } from "./foodItemsApi";
import { ordersApi } from "./ordersApi";
import { menuApi } from "./menuApi";
import { addressesApi } from "./addressesApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    menu: menuReducer,
    order: orderReducer,
    admin: adminReducer,
    [authApi.reducerPath]: authApi.reducer,
    [foodItemsApi.reducerPath]: foodItemsApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [menuApi.reducerPath]: menuApi.reducer,
    [addressesApi.reducerPath]: addressesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(foodItemsApi.middleware)
      .concat(ordersApi.middleware)
      .concat(menuApi.middleware)
      .concat(addressesApi.middleware),
});
