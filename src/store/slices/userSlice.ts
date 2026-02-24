import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UserInfo {
  user_id: number;
  name: string;
  role_code: number;
  student_no?: string;
}

interface UserState {
  token: string | null;
  userInfo: UserInfo | null;
}

const initialState: UserState = {
  token: localStorage.getItem('token'),
  userInfo: JSON.parse(localStorage.getItem('userInfo') || 'null'),
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ token: string; userInfo: UserInfo }>) => {
      state.token = action.payload.token;
      state.userInfo = action.payload.userInfo;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('userInfo', JSON.stringify(action.payload.userInfo));
    },
    logout: (state) => {
      state.token = null;
      state.userInfo = null;
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
    },
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
