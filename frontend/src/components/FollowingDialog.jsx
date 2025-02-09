import React from 'react';
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import {
   Avatar,
   AvatarFallback,
   AvatarImage,
} from "./ui/avatar.jsx";
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {Button} from './ui/button.jsx';
import { BsArrowUpRightSquare } from "react-icons/bs";
import {NavLink} from 'react-router-dom';

export default function  FollowersDialog({followingsDialogOpen, setFollowingsDialogOpen})  {
   const {userProfile} = useSelector(store=>store.auth);
   const [following, setFollowing] = useState([]);
   useEffect(() => {  
      const getFollowing = async () => {
         try {
            const res = await axios.get(`http://localhost:8000/api/v1/user/${userProfile?._id}/following`, { withCredentials: true });
            if (res.data.success) {
               setFollowing(res.data.following);
            }
         } catch (error) {
            console.log(error);
         }
      };
      getFollowing();
   }, [userProfile]);
   
   return (
      <div>
         <Dialog open={followingsDialogOpen} onOpenChange={setFollowingsDialogOpen}>
            <DialogContent onInteractOutside={() => setFollowingsDialogOpen(false)} className="text-black">
               <DialogTitle className="mx-auto underline">Followers</DialogTitle>
               <div className="flex flex-col gap-2 border border-black rounded-md max-h-[65vh] overflow-y-auto p-2">
                  {
                     following.length === 0
                     ? <div className="mx-auto">This user is not following anyone.</div>
                     : following.map((f) => {
                        return <div className="flex flex-row justify-between items-center border border-green-300 rounded-md py-1 px-2 bg-green-100">
                           <div className="flex flex-row items-center gap-2">
                              <Avatar>
                                 <AvatarImage src={f.profilePicture} className="object-cover" />
                                 <AvatarFallback>CN</AvatarFallback>
                              </Avatar>
                              <span className=""><b>@</b>{f.username}</span>
                           </div>
                           
                           <NavLink to={`/profile/${f.username}`} onClick={() => setFollowingsDialogOpen(false)} >
                              <BsArrowUpRightSquare className="text-2xl" />
                           </NavLink>
                        </div>
                     })  
                  }
               </div>
            </DialogContent>
         </Dialog>
      </div>
   );
};
