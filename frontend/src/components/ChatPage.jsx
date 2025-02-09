import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import useGetSuggestedUsers from '../hooks/useGetSuggestedUsers.jsx';
import { NavLink } from 'react-router-dom';
import { Badge } from "./ui/badge.jsx";
import { setChatSelectedUser } from '../redux/authSlice.js';
import { MessageCircleCode } from 'lucide-react';
import { Button } from './ui/button.jsx';
import Messages from './Messages.jsx';
import axios from 'axios';
import { setMessages } from '../redux/chatSlice.js';
import {setResponsive} from '../redux/responsiveSlice.js';
import { MdCancel } from "react-icons/md";

export default function ChatPage() {
   const dispatch = useDispatch();
   useGetSuggestedUsers();
   const { user, suggestedUsers, chatSelectedUser } = useSelector(store=>store.auth);
   const { onlineUsers, messages } = useSelector(store=>store.chat);
   const { responsive } = useSelector(store=>store.responsive);  // false
   
   const [selectedUser, setSelectedUser] = useState(null);
   const [textMessage, setTextMessage] = useState('');
   
   const sendMessageHandler = async (reciverId) => {
      try {
         const res = await axios.post(`https://instadebo.onrender.com/api/v1/message/send/${reciverId}`, { textMessage }, {
            headers:{
               'Content-Type':'application/json'
            },
            withCredentials:true
         });
         if (res.data.success) {
            dispatch(setMessages([...messages, res.data.newMessage]));
            setTextMessage('');
         }
      } catch (error) {
         console.log(error);
      }
   };
   
   // useEffect(() => {  
   //    dispatch(setChatSelectedUser(null));
   // }, []);
   
   return (
      <div className="flex h-[83vh] bg-gray-900 text-white m-2 rounded">
      {/* Left Sidebar */}
      <div className={`w-full sm:w-1/4 bg-gray-800 p-3 rounded sm:block ${responsive ? 'hidden' : 'block'}`}>
         <h1 className="text-xl font-bold">User</h1>
         <div className="flex flex-row justify-center py-1 px-2 rounded-lg items-center gap-2 bg-slate-900">
            <img className="w-8 h-8 rounded-full object-cover" src={user?.profilePicture || 'https://w7.pngwing.com/pngs/247/564/png-transparent-computer-icons-user-profile-user-avatar-blue-heroes-electric-blue.png'} alt="" />
            <div className="flex flex-col">
               <p>{user.fullName}</p>
               <p>@{user.username}</p>
            </div>
         </div>
         <h2 className="text-xl font-bold mb-1 mt-4">Suggested Users</h2>
         <div className="flex flex-col gap-2 h-[58vh] sm:h-[59vh] overflow-auto border border-gray-300 p-2 rounded-lg">
            {suggestedUsers.map((suggestedUser) => {
               const isOnline = onlineUsers.includes(suggestedUser?._id);
               return (
                  <div
                  key={suggestedUser._id}
                  className={`p-3 cursor-pointer rounded-md hover:bg-gray-700 ${
                     chatSelectedUser?._id === suggestedUser._id ? "bg-gray-700" : "bg-gray-900"
                  } flex items-center gap-2`}
                  onClick={() =>dispatch(setResponsive(true)) && dispatch(setChatSelectedUser(suggestedUser))}
               >
                  <img className="w-8 h-8 rounded-full object-cover" src={suggestedUser?.profilePicture || 'https://w7.pngwing.com/pngs/247/564/png-transparent-computer-icons-user-profile-user-avatar-blue-heroes-electric-blue.png'} alt="" />
                  <div className="flex gap-1">
                     <span className="">{suggestedUser?.username}</span>
                     {isOnline && <div className="h-2 w-2 bg-green-400 rounded-full"></div>}
                  </div>
               </div>
               )
            })}
         </div>
      </div>

      {/* Chat Room */}
      <div className={`w-full sm:w-3/4 p-2 flex flex-col sm:block ${responsive ? 'block' : 'hidden'}`}>
         {chatSelectedUser ? (
            <>
            <div className="bg-gray-800 px-2 py-1 rounded-md flex flex-row justify-between items-center gap-2">
               <div className="flex flex-row justify-center items-center gap-2">
                  <img className="w-8 h-8 rounded-full object-cover" src={chatSelectedUser.profilePicture || 'https://w7.pngwing.com/pngs/247/564/png-transparent-computer-icons-user-profile-user-avatar-blue-heroes-electric-blue.png'} alt="" />
                  <div className="flex flex-col">
                     <NavLink to={`/profile/${chatSelectedUser.username}`} className="hover:underline">
                        <p className="text-lg font-semibold">{chatSelectedUser.fullName}</p>
                     </NavLink>
                     { onlineUsers.includes(chatSelectedUser?._id) ? <div className="text-xs text-green-400">online</div> : <div className="text-xs text-red-500">offline</div> }
                  </div>
               </div>
               
               <div onClick={() => dispatch(setResponsive(false)) && dispatch(setChatSelectedUser(null))}>
                  <MdCancel className="text-2xl" />
               </div>
            </div>
            
            <div className="bg-gray-700 p-4 my-4 rounded-md overflow-y-auto">
               <Messages chatSelectedUser={chatSelectedUser} />
            </div>
            
            <div className="flex bottom-0">
               <input
                  value={textMessage}
                  onChange={(e)=>setTextMessage(e.target.value)}
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 p-2 bg-gray-800 text-white rounded-md outline-none"
               />
               <button 
                  onClick={() => sendMessageHandler(chatSelectedUser?._id)}
                  className="ml-2 px-4 py-2 bg-blue-500 rounded-md"
               >
                  Send
               </button>
            </div>
            </>
         ) : (
            <>
               <p className="flex-col gap-2 text-center flex-1 flex items-center justify-center h-full">
                  <MessageCircleCode className="w-32 h-32 text-white" />
                  <b>Your messages</b>
                  <p>Select a user to start chatting</p>
               </p>
            </>
        )}
      </div>
    </div>
  );
}
