import React from "react";
import {
   Avatar,
   AvatarFallback,
   AvatarImage,
} from "./ui/avatar.jsx";
import { NavLink } from 'react-router-dom';

export default function Comment({ comment }) {
   
   return (
      <div className="p-2 bg-white rounded-lg shadow-md mb-3 sm:flex sm:items-center sm:justify-between">
         {/* User Info & Comment */}
         <div className="flex items-center gap-2">
            <NavLink to={`/profile/${comment?.author?.username}`}>   
            <Avatar className="w-6 h-6 sm:w-10 sm:h-10">
               <AvatarImage
                  className="rounded-full object-cover"
                  src={comment?.author?.profilePicture}
                  alt="profilePicture"
               />
               <AvatarFallback className="text-white bg-gray-500">CN</AvatarFallback>
            </Avatar>
            </NavLink>
            
            <div className="flex flex-col">
               <div className="flex items-center gap-2 sm:gap-3">
                  <NavLink to={`/profile/${comment?.author?.username}`}>
                  <h4 className="text-gray-900 font-semibold text-sm sm:text-base">
                     {comment?.author?.username}
                  </h4>
                  </NavLink>
                  <p className="text-gray-500 text-xs sm:hidden">
                     {new Date(comment?.createdAt).toLocaleString()}
                  </p>
               </div>
               <p className="text-gray-800 text-sm">{comment?.text}</p>
            </div>
         </div>

         {/* Timestamp for larger screens */}
         <p className="hidden sm:block text-gray-600 text-[0.70rem]">
            {new Date(comment?.createdAt).toLocaleString()}
         </p>
      </div>
   );
}