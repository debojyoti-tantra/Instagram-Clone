import React from "react";
import { useState, useEffect } from 'react';
import {
   Avatar,
   AvatarFallback,
   AvatarImage,
} from "./ui/avatar.jsx";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import {MoreHorizontal} from 'lucide-react';
import {Button} from './ui/button.jsx';
import { FaHeart, FaRegHeart, FaCommentDots, FaRegBookmark } from "react-icons/fa";
import { IoBookmarks } from "react-icons/io5";
import { IoIosSend } from "react-icons/io";
import CommentDialog from "./CommentDialog.jsx";
import {NavLink} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios';
import { setPosts, setSelectedPost } from '../redux/postSlice.js';
import { Loader2 } from 'lucide-react';
import { Badge } from "./ui/badge.jsx";

export default function Post({post}) {
   const {user} = useSelector(store=>store.auth);
   const {posts} = useSelector(store=>store.post);
   const [text, setText] = useState("");
   const [open, setOpen] = useState(false);
   const [loading,setLoading] = useState(false);
   const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
   const [postLike, setPostLike] = useState(post.likes.length);
   const [comment, setComment] = useState(post.comments);
   const dispatch = useDispatch();
   
   const changeEventHandler = (e) => {
      const inputText = e.target.value;
      if (inputText.trim()) {
         setText(inputText);
      } else {
         setText("");
      }
   };
   
   const likeDislikeHandler = async () => {
      try {
         const action = liked ? 'dislike' : 'like';
         const res = await axios.get(`/api/v1/post/${post._id}/${action}`, {withCredentials:true});
         if (res.data.success) {
            const updatedLikes = liked ? postLike-1 : postLike+1;
            setPostLike(updatedLikes);
            setLiked(!liked)
            // update your own post
            const updatedPostData = posts.map((p) => 
               p._id === post._id ? {
                  ...p,
                  likes:liked ? p.likes.filter(id => id !==  user._id) : [...p.likes, user._id]
               } : p
            );
            dispatch(setPosts(updatedPostData));
            toast.success(res.data.message);
         }
      } catch (error) {
         console.log(error);
      }
   };
   
   const commentHandler = async () => {
      try {
         const res = await axios.post(`/api/v1/post/${post._id}/comment`, {text}, {
            headers: {
               'Content-Type': 'application/json'
            },
            withCredentials: true
         });
         if (res.data.success) {
            const updatedCommentData = [...comment, res.data.comment];
            setComment(updatedCommentData);
            
            const updatedPostData = posts.map((p) => 
               p._id === post._id ? {...p, comments: updatedCommentData} : p
            );
            dispatch(setPosts(updatedPostData));
            toast.success(res.data.message);
         }
      } catch (error) {
         console.log(error);
         toast.error(error.response.data.message);
      } finally {
         setText('');
      }
   };
   
   const deletePostHandler = async () => {
      try {
         setLoading(true);
         const res = await axios.delete(`/api/v1/post/delete/${post?._id}`, {withCredentials:true});
         if (res.data.success) {
            const updatedPostData = posts.filter((postItem) => postItem?._id !== post?._id)
            dispatch(setPosts(updatedPostData));
            toast.success(res.data.message);
         }
      } catch (error) {
         console.log(error);
         toast.error(error.response.data.message);
      } finally {
         setLoading(false);
      }
   };
   
   const bookmarkHandler = async () => {
      try {
         const res = await axios.get(`/api/v1/post/${post._id}/bookmark`, {withCredentials:true});
         console.log(res);
         if (res.data.success) {
            toast.success(res.data.message);
         }
      } catch (error) {
         console.log(error);
         toast.error(error.response.data.message);
      }
   };
   
   return (
      <div className="bg-gray-900 text-white p-4 sm:w-[50vw] mx-auto rounded-lg shadow-lg">
         {/* Post Header */}
         <div className="flex items-center justify-between">
            <NavLink to={`/profile/${post?.author.username}`}>
            <div className="flex items-center gap-3 mb-4">
               <Avatar className="rounded-full w-10 h-10">
                  <AvatarImage
                     className="w-10 h-10 rounded-full object-cover"
                     src={post?.author.profilePicture}
                     alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
               </Avatar>
               <div>
                  <h2 className="font-semibold text-sm">{post?.author.fullName} {user?._id===post?.author._id && <Badge className="bg-red-700 ">You</Badge>}</h2>
                  <p className="text-xs text-gray-400">{new Date(post.date || post.createdAt).toLocaleString()}</p>
               </div>
            </div>
            </NavLink>
            
            <div>
               <Dialog>
                  <DialogTrigger asChild>
                     <MoreHorizontal className="cursor-pointer bg-slate-800 rounded" />
                  </DialogTrigger>
                  <DialogContent>
                     {
                        user && user?._id===post?.author?._id ? (
                           <>
                              <Button onClick={bookmarkHandler} className="text-white">Bookmark</Button>
                              {
                                 loading ? (
                                       <Button className="mt-3 text-white bg-red-700 hover:bg-red-900">
                                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                          Please Wait
                                       </Button>
                                 ) : (
                                    <Button onClick={deletePostHandler} className="text-white bg-red-700 hover:bg-red-900">Delete</Button>
                                 )
                              }
                           </>
                        ) : (
                           <>
                              <Button onClick={bookmarkHandler} className="text-white">Bookmark</Button>
                           </>
                        )
                     }
                  </DialogContent>
               </Dialog>
            </div>
         </div>
         
         {/*post image*/}
         <img
            src={post.image}
            alt="post_image"
            className="rounded-md mx-auto"
         />
         
         {/*like section*/}
         <div className="flex p-1 mt-2 justify-between items-center">
            {/*<FaHeart className="text-pink-600 text-3xl" />*/}
            <div className="flex gap-3">
               {
                  liked ? (
                     <FaHeart onClick={likeDislikeHandler} className="text-3xl text-red-500" />
                  ) : (
                     <FaRegHeart onClick={likeDislikeHandler} className="text-3xl" />
                  )
               }
               <FaCommentDots onClick={(e) => { dispatch(setSelectedPost(post)) && setOpen(true) } } className="text-3xl hover:text-blue-300" />
               <IoIosSend className="text-3xl hover:text-green-300" />
            </div>
            <IoBookmarks onClick={bookmarkHandler} className="text-3xl" />
         </div>
         
         <span>
           {post.likes.length === 0 || post.likes.length === 1 
             ? `${postLike} like` 
             : `${postLike} likes`}
         </span>
         <div className="flex gap-2">
            <span className="font-semibold">{post.author.username}</span>
            <span className="text-gray-100">{post.caption}</span>
         </div>
         {comment.length!==0 && <span onClick={(e) => { dispatch(setSelectedPost(post)) && setOpen(true) } } className="cursor-pointer text-sm text-gray-200 hover:text-gray-500">view all {comment.length} comments</span>}
         <CommentDialog open={open} setOpen={setOpen} />
         <div className="flex gap-2 text-gray-200">
            <input
               type="text"
               placeholder="Add a comment..."
               className="outline-none text-sm w-full bg-slate-900 h-8"
               value={text}
               onChange={changeEventHandler}
            />
            {text && <button onClick={commentHandler} className="rounded px-2 py-1 bg-slate-800 hover:bg-slate-700 cursor-pointer">Post</button>}
         </div>
      </div>
   );
}