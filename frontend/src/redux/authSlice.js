import { createSlice, configureStore } from '@reduxjs/toolkit';

const authSlice = createSlice({
   name:"auth",
   initialState:{
      user:null,
      suggestedUsers:[],
      userProfile:null,
      chatSelectedUser:null,
   },
   reducers:{
      setAuthUser:(state,action) => {
         state.user = action.payload;
      },
      setSuggestedUsers:(state,action) => {
         state.suggestedUsers = action.payload;
      },
      setUserProfile:(state,action) => {
         state.userProfile = action.payload;
      },
      setChatSelectedUser:(state,action) => {
         state.chatSelectedUser = action.payload;
      }
   }
});

export const { setAuthUser, setSuggestedUsers, setUserProfile, setChatSelectedUser } = authSlice.actions;
export default authSlice.reducer;