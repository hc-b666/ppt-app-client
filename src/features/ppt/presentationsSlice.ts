import { createSlice } from "@reduxjs/toolkit";
import { pptApi } from "./presentationService";

interface PresentationsState {
  presentations: PresentationAuthorClaim[];
}

const initialState: PresentationsState = {
  presentations: [],
};

const presentationsSlice = createSlice({
  name: "presentations",
  initialState,
  selectors: {
    selectAuthorToken: (state, id) => {
      const ppt = state.presentations.find((ppt) => ppt.presentationId === id);
      if (!ppt) return;

      return ppt.authorToken;
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      pptApi.endpoints.createPresentation.matchFulfilled,
      (state, action) => {
        state.presentations.push(action.payload.data);
      }
    );
  },
});

export const { selectAuthorToken } = presentationsSlice.selectors;
export const {} = presentationsSlice.actions;
export default presentationsSlice.reducer;
