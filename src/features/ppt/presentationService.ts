import { api } from "@/common/services/api";

const pptApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createPresentation: builder.mutation<Response, { title: string; description?: string; author: string }>({
      query: (body) => ({
        url: "/presentations/create",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useCreatePresentationMutation } = pptApi;
