import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  nickname: string | null;
}

const initialState: UserState = {
  nickname: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  selectors: {
    selectNickname: (state) => state.nickname,
  },
  reducers: {
    setNickname(state, action: PayloadAction<string>) {
      state.nickname = action.payload;
    },
  },
});

export const { selectNickname } = userSlice.selectors;
export const { setNickname } = userSlice.actions;
export default userSlice.reducer;
