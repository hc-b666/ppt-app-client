import { api } from "@/common/services/api";

interface CreateSlideRequest {
  pptId: string;
  authorToken: string;
}

export const slideApi = api.injectEndpoints({
  endpoints: (builder) => ({
    findAllSlides: builder.query<Slide[], string | undefined>({
      query: (pptId) => ({
        url: `/slides/${pptId}`,
        method: "GET",
      }),
      providesTags: ["Slide"],
    }),
    createSlide: builder.mutation<Response, CreateSlideRequest>({
      query: ({ pptId, authorToken }) => ({
        url: `/slides/${pptId}/create?authorToken=${authorToken}`,
        method: "POST",
      }),
      invalidatesTags: ["Slide"],
    }),
  }),
});

export const { useFindAllSlidesQuery, useCreateSlideMutation } = slideApi;
