import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setUserProfile } from '../redux/authSlice.js';

const useGetUserProfile = (username) => {
   const dispatch = useDispatch();
   
   useEffect(() => {  
      const fetchUserProfile = async () => {
         try {
            const res = await axios.get(`http://localhost:8000/api/v1/user/${username}/profile`, {withCredentials:true});
            if (res.data.success)  {
               dispatch(setUserProfile(res.data.user));
            }
         } catch (error) {
            console.log(error);
         }
      }
      
      fetchUserProfile();
   }, [username]);
};

export default useGetUserProfile;