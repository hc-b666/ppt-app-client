import { api } from "@/common/services/api";

interface VerifyAuthorRequest {
  pptId: string;
  authorToken: string;
}

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
    verifyAuthor: builder.mutation<{ isAuthor: boolean }, VerifyAuthorRequest>({
      query: ({ pptId, authorToken }) => ({
        url: `/presentations/${pptId}/verify-author`,
        method: "POST",
        body: { authorToken },
      }),
    }),
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
        url: `/presentations/${pptId}/edit-title?authorToken=${authorToken}`,
        method: "PUT",
        body: { title },
      }),
      invalidatesTags: ["Presentation"],
    }),
  }),
});

export const {
  useVerifyAuthorMutation,
  useFindAllPresentationsQuery,
  useFindByIdQuery,
  useCreatePresentationMutation,
  useUpdateTitleMutation,
} = pptApi;
