import { createSlice, configureStore } from '@reduxjs/toolkit';

const rtnSlice = createSlice({
   name: 'rtn',
   initialState: {
      likeNotification: [],
   },
   reducers: {
      setLikeNotification: (state, action) => {
         if (Array.isArray(action.payload)) {
            return { ...state, likeNotification: action.payload }; // Properly replacing the state
         } else if (action.payload.type === 'like') {
            return { ...state, likeNotification: [...state.likeNotification, action.payload] };
         } else if (action.payload.type === 'dislike') {
            return {
               ...state,
               likeNotification: state.likeNotification.filter((item) => item.userId !== action.payload.userId)
            };
         }
      }
   }
});

export const { setLikeNotification } = rtnSlice.actions;
export default rtnSlice.reducer;