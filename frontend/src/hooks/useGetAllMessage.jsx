import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setMessages } from '../redux/chatSlice.js';

const useGetAllMessage = () => {
   const {messages} = useSelector(store=>store.chat)
   const dispatch = useDispatch();
   const {chatSelectedUser} = useSelector(store=>store.auth);
   
   useEffect(() => {  
      const fetchAllMessage = async () => {
         try {
            const res = await axios.get(`http://localhost:8000/api/v1/message/${chatSelectedUser._id}`, {withCredentials:true});
            console.log(res);
            if (res.data.success)  {
               dispatch(setMessages(res.data.messages));
            }
         } catch (error) {
            console.log(error);
         }
      };
      
      fetchAllMessage();
   // }, [messages, chatSelectedUser, dispatch]);
   }, [chatSelectedUser]);
};

export default useGetAllMessage;