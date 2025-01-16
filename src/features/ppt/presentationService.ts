import { api } from "@/common/services/api";

interface CreateRequest {
  title: string;
  description?: string;
  author: string;
}

interface CreateResponse extends Response {
  data: PresentationAuthorClaim;
}

interface UpdateTitleRequest {
  pptId: string;
  title: string;
  authorToken: String;
}

export const pptApi = api.injectEndpoints({
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
      providesTags: ["Presentation"],
    }),
    createPresentation: builder.mutation<CreateResponse, CreateRequest>({
      query: (body) => ({
        url: "/presentations/create",
        method: "POST",
        body,
      }),
    }),
    updateTitle: builder.mutation<Response, UpdateTitleRequest>({
      query: ({ pptId, title, authorToken }) => ({
        url: `/presentations/edit-title/${pptId}?authorToken=${authorToken}`,
        method: "PUT",
        body: { title },
      }),
      invalidatesTags: ["Presentation"],
    }),
  }),
});

export const {
  useFindAllPresentationsQuery,
  useFindByIdQuery,
  useCreatePresentationMutation,
  useUpdateTitleMutation,
} = pptApi;
