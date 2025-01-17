import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_BASE_URL } from "../constants";

const baseQuery = fetchBaseQuery({
  baseUrl: `${BACKEND_BASE_URL}/api`,
});

export const api = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Presentation", "Slide"],
  endpoints: () => ({}),
});
