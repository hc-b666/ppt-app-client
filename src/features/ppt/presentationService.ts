import { api } from "@/common/services/api";

interface CreateRequestBody {
  title: string;
  description?: string;
  author: string;
}

const pptApi = api.injectEndpoints({
  endpoints: (builder) => ({
    findAllPresentations: builder.query<Presentation[], void>({
      query: () => ({
        url: "/presentations",
        method: "GET",
      }),
    }),
    findById: builder.query<Presentation, string | undefined>({
      query: (id) => ({
        url: `/presentations/${id}`,
        method: "GET",
      }),
    }),
    createPresentation: builder.mutation<Response, CreateRequestBody>({
      query: (body) => ({
        url: "/presentations/create",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useFindAllPresentationsQuery,
  useFindByIdQuery,
  useCreatePresentationMutation,
} = pptApi;
