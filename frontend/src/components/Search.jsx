import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar.jsx";
import { NavLink } from "react-router-dom";
import useGetSuggestedUsers from "../hooks/useGetSuggestedUsers.jsx";
import { Button } from './ui/button.jsx';
import axios from 'axios';
import { setAuthUser, setUserProfile } from '../redux/authSlice.js';
import { toast } from 'sonner';
import { useSelector, useDispatch } from 'react-redux';

export default function Search() {
   useGetSuggestedUsers();
   const dispatch = useDispatch();
   const { user, suggestedUsers = [] } = useSelector(store => store.auth);
   const [searchQuery, setSearchQuery] = useState("");

   // 🔍 Filter users based on search query
   const filteredUsers = suggestedUsers.filter(suser => 
      suser.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      suser.username.toLowerCase().includes(searchQuery.toLowerCase())
   );

   return (
      <div className="max-w-lg mx-auto bg-gray-900 text-white p-4 rounded-lg shadow-lg">
         {/* 🔍 Search Input */}
         <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 mb-3 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
         />

         {/* 🏠 Current User */}
         <NavLink to={`/profile/${user?.username}`} className="block mb-4 p-3 bg-gray-800 rounded-lg shadow-md hover:bg-gray-700 transition">
            <div className="flex items-center gap-3">
               <Avatar className="rounded-full w-12 h-12">
                  <AvatarImage className="object-cover" src={user?.profilePicture} alt="profilePicture" />
                  <AvatarFallback>CN</AvatarFallback>
               </Avatar>
               <div>
                  <h2 className="font-semibold text-md">{user?.fullName}</h2>
                  <h2 className="text-sm text-gray-400">@{user?.username}</h2>
               </div>
            </div>
         </NavLink>

         {/* 📜 Suggested Users */}
         <div className="bg-gray-800 rounded-lg shadow-md p-3 h-[55vh] overflow-auto">
            <h2 className="text-lg font-semibold mb-2 text-gray-300">Suggested Users</h2>
            {filteredUsers.length === 0 ? (
               <p className="text-gray-400 text-center">No users found</p>
            ) : (
               filteredUsers.map(suser => {
                  const isFollowing = user?.following?.includes(suser._id);
                  
                  const followUnfollowHandler = async () => {
                     try {
                        const res = await axios.get(`/api/v1/user/followOrUnfollow/${suser._id}`, { withCredentials: true });
                  
                        if (res.data.success) {
                           toast.success(res.data.message);
                  
                           // Update Redux state for the logged-in user
                           dispatch(setAuthUser(res.data.updatedUser));
                           
                        }
                     } catch (error) {
                        console.log(error);
                        toast.error(error.response?.data?.message || "An error occurred");
                     }
                  };
                  
                  return (<div className="flex justify-between items-center">
                     <NavLink key={suser?._id} to={`/profile/${suser?.username}`} className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-700 transition">
                        <Avatar className="rounded-full w-10 h-10">
                           <AvatarImage className="object-cover" src={suser?.profilePicture} alt="profilePicture" />
                           <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div>
                           <h2 className="font-semibold text-md text-gray-200">{suser?.fullName}</h2>
                           <h2 className="text-sm text-gray-400">@{suser?.username}</h2>
                        </div>
                     </NavLink>
                     {
                        isFollowing ? <Button onClick={followUnfollowHandler} className="hover:bg-purple-700 bg-purple-700 w-24">Unfollow</Button> : <Button onClick={followUnfollowHandler} className="hover:bg-blue-600 bg-blue-600 w-24">Follow</Button>
                     }
                  </div>
               )})
            )}
         </div>
      </div>
   );
}
