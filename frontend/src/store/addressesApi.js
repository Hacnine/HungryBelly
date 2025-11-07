import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export const addressesApi = createApi({
  reducerPath: "addressesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/addresses`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["Address"],
  endpoints: (builder) => ({
    getUserAddresses: builder.query({
      query: () => ({ url: `/`, method: "GET" }),
      providesTags: ["Address"],
    }),
    getAddress: builder.query({
      query: (id) => ({ url: `/${id}`, method: "GET" }),
      providesTags: ["Address"],
    }),
    createAddress: builder.mutation({
      query: (body) => ({ url: `/`, method: "POST", body }),
      invalidatesTags: ["Address"],
    }),
    updateAddress: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/${id}`, method: "PUT", body }),
      invalidatesTags: ["Address"],
    }),
    deleteAddress: builder.mutation({
      query: (id) => ({ url: `/${id}`, method: "DELETE" }),
      invalidatesTags: ["Address"],
    }),
    setDefaultAddress: builder.mutation({
      query: (id) => ({ url: `/${id}/default`, method: "PATCH" }),
      invalidatesTags: ["Address"],
    }),
  }),
});

export const {
  useGetUserAddressesQuery,
  useGetAddressQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation,
} = addressesApi;