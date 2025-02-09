import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setMessages } from '../redux/chatSlice.js';

const useGetRTM = () => {
   const dispatch = useDispatch();
   const {messages} = useSelector(store=>store.chat);
   const {socket} = useSelector(store=>store.socketio);
   
   useEffect(() => {  
      socket?.on('newMessage', (newMessage) => {
         dispatch(setMessages([...messages, newMessage]));
      });
      
      return () => {
         socket?.off('newMessage');
      }
   }, [messages, setMessages]);
};

export default useGetRTM;