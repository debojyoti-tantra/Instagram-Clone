import React, {useRef} from 'react';
import { useState, useEffect } from 'react';
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
import store from '../redux/store.js';
import { useSelector, useDispatch } from 'react-redux';
import { readFileAsDataURL } from '@/lib/utils.js';
import { Button } from './ui/button.jsx';
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { NavLink, useNavigate } from 'react-router-dom';
import {setPosts} from '../redux/postSlice.js';

export default function  CreatePost({open, setOpen})  {
   const imageRef = useRef();
   const [file, setFile] = useState("");
   const [caption, setCaption] = useState("");
   const [imagePreview, setImagePreview] = useState("");
   const [loading,setLoading] = useState(false);
   const navigate = useNavigate();
   const dispatch = useDispatch();
   
   const filechangeHandler = async (e) => {
      const file = e.target.files?.[0];
      if (file) {
         setFile(file);
         const dataUrl = await readFileAsDataURL(file);
         setImagePreview(dataUrl);
      }
   };
   const {user} = useSelector(store=>store.auth);
   const {posts} = useSelector(store=>store.post);
   
   const createPostHandler = async (e) => {
      const formData = new FormData();
      formData.append("caption", caption);
      if (imagePreview) formData.append("image", file);
      
      try {
         setLoading(true);
         const res = await axios.post("/api/v1/post/addPost", formData, {
            headers: {
               'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
         });
         
         if (res.data.success) {
            setImagePreview("");
            setCaption("");
            navigate('/')
            dispatch(setPosts([res.data.post,...posts]));
            toast.success(res.data.message);
         }
      } catch (error) {
         toast.error(error.response.data.message);
      } finally {
         setLoading(false);
         setOpen(false);
      }
   };
   
   return (
      <Dialog open={open}>
         <DialogContent onInteractOutside={() => setOpen(false)} className="p-2 text-black">
            <DialogTitle className="mx-auto underline">Create Post</DialogTitle>
            <div className="">
               <div className="flex justify-center items-center gap-3">
                  <Avatar>
                     <AvatarImage className="object-cover" src={user?.profilePicture} alt="profilePicture" />
                     <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                     <div className="font-semibold">{user?.fullName}</div>
                     <div className="outline-zinc-800">@{user?.username}</div>
                  </div>
               </div>
               <textarea value={caption} onChange={(e) => setCaption(e.target.value)} className="w-full h-[10vh] border rounded-lg border-zinc-500 p-2 my-1" placeholder="write a caption for your post..." />
               <input ref={imageRef} type="file" className="hidden" onChange={filechangeHandler} />
               {imagePreview && <div className="flex flex-col gap-2">
                     <img src={imagePreview} alt="imagePreview" className="h-[30vh] mx-auto mb-3" />
               </div>}
               <div className="flex justify-center items-center">
                  <button onClick={() => imageRef.current.click()} className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white py-2 px-4 rounded-lg font-semibold shadow-lg transition-transform transform hover:scale-105 w-[50%]">Select a photo from your device</button>
               </div>
               {
                  imagePreview && (
                     loading ? (
                        <div className="flex justify-center items-center">
                           <Button className="mt-3">
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Please Wait
                           </Button>
                        </div>
                     ) : (
                        <div className="flex justify-center items-center">
                           <Button onClick={createPostHandler} type="submit" className="w-full mt-3 w-[53%]">
                              Post
                           </Button>
                        </div>
                     )
                  )
               }
            </div>
         </DialogContent>
      </Dialog>
   );
};