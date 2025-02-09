import React from 'react';
import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from './ui/button.jsx';
import { useSelector, useDispatch } from 'react-redux';
import useGetAllMessage from '../hooks/useGetAllMessage.jsx';
import useGetRTM from '../hooks/useGetRTM.jsx';

export default function  Messages({chatSelectedUser})  {
   const scroll = useRef();
   useGetRTM();
   useGetAllMessage();
   const {user} = useSelector(store=>store.auth);
   const {messages} = useSelector(store=>store.chat);
   
   useEffect(() => {  
      scroll.current?.scrollIntoView({behavior:"smooth"});
   }, [messages]);
   
   return (
      <div>
         <div className="flex flex-col items-center gap-1">
            <img src={chatSelectedUser.profilePicture || 'https://w7.pngwing.com/pngs/247/564/png-transparent-computer-icons-user-profile-user-avatar-blue-heroes-electric-blue.png'} className="rounded-full object-cover w-32 h-32" alt="profilePicture" />
            <p className="font-semibold">{chatSelectedUser.fullName}</p>
            <div className="flex gap-1 text-sm">
               <p>@{chatSelectedUser.username}</p> : <p>{chatSelectedUser.email}</p>
            </div>
            <NavLink to={`/profile/${chatSelectedUser.username}`} className="mt-1"><Button>View Profile</Button></NavLink>
         </div>
         
         <div className="h-[30vh] sm:h-[25vh]">
            {
               messages && messages.map((msg) => {
                  return <div ref={scroll} className={`flex ${user._id===msg.senderId ? 'justify-end' : 'justyfy-start'}`}>
                     <div className="flex flex-col mb-2">
                        <div 
                           className={`flex m-1 py-1 px-2 rounded-md max-w-xs break-words ${user._id===msg.senderId ? 'bg-blue-500' : 'bg-zinc-300 text-black'}`}
                           >
                           {msg.message}
                        </div>
                        <div className="text-[10px]">
                           {new Date(msg.date || msg.createdAt).toLocaleString()}
                        </div>
                     </div>
                  </div>
               })
            }
         </div>
      </div>
   );
};
