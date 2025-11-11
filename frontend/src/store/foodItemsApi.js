import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const foodItemsApi = createApi({
  reducerPath: "foodItemsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/food-items`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["FoodItem"],
  endpoints: (builder) => ({
    getFoodItems: builder.query({
      query: () => ({ url: `/`, method: "GET" }),
      providesTags: ["FoodItem"],
    }),
    getFoodItem: builder.query({
      query: (id) => ({ url: `/${id}`, method: "GET" }),
      providesTags: ["FoodItem"],
    }),
    createFoodItem: builder.mutation({
      query: (body) => ({ url: `/`, method: "POST", body }),
      invalidatesTags: ["FoodItem"],
    }),
    updateFoodItem: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/${id}`, method: "PUT", body }),
      invalidatesTags: ["FoodItem"],
    }),
    deleteFoodItem: builder.mutation({
      query: (id) => ({ url: `/${id}`, method: "DELETE" }),
      invalidatesTags: ["FoodItem"],
    }),
  }),
});

export const {
  useGetFoodItemsQuery,
  useGetFoodItemQuery,
  useCreateFoodItemMutation,
  useUpdateFoodItemMutation,
  useDeleteFoodItemMutation,
} = foodItemsApi;
