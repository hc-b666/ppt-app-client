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
  reducers: {
    setNickname(state, action: PayloadAction<{ nickname: string }>) {
      state.nickname = action.payload.nickname;
    },
  },
});

export const { setNickname } = userSlice.actions;
export default userSlice.reducer;
