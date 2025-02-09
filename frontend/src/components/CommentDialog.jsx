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
import {MoreHorizontal} from 'lucide-react';
import {Button} from './ui/button.jsx';
import {NavLink} from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Comment from './Comment.jsx';
import axios from 'axios';
import { toast } from 'sonner';
import { setPosts, setSelectedPost } from '../redux/postSlice.js';

export default function  CommentDialog({open, setOpen})  {
   const {selectedPost,posts} = useSelector(store=>store.post);
   const dispatch = useDispatch();
   
   const [text, setText] = useState("");
   const [comment, setComment] = useState([]);
   useEffect(() => {  
      if (selectedPost) {
         setComment(selectedPost?.comments);
      }
   }, [selectedPost]);
   const changeEventHandler = (e) => {
      const inputText = e.target.value;
      if (inputText.trim()) {
         setText(inputText);
      } else {
         setText('');
      }
   };
   
   const commentHandler = async () => {
      try {
         const res = await axios.post(`https://instadebo.onrender.com/api/v1/post/${selectedPost._id}/comment`, {text}, {
            headers: {
               'Content-Type': 'application/json'
            },
            withCredentials: true
         });
         if (res.data.success) {
            const updatedCommentData = [...comment, res.data.comment];
            setComment(updatedCommentData);
            
            const updatedPostData = posts.map((p) => 
               p._id === selectedPost._id ? {...p, comments: updatedCommentData} : p
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
   
   return (
      <Dialog open={open}>
         <DialogContent onInteractOutside={ () => {dispatch(setSelectedPost(null)) && setOpen(false) } } className="p-2">
               <div className="py-1 flex flex-col">
                  <div className="flex items-center justify-center pr-1">
                     <NavLink to={`/profile/${selectedPost?.author.username}`}>
                     <div className="flex items-center gap-3">
                        <Avatar className="rounded-full w-10 h-10">
                           <AvatarImage
                              className="w-10 h-10 rounded-full"
                              src={selectedPost?.author?.profilePicture}
                              alt="@shadcn"
                           />
                           <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div>
                           <h2 className="font-semibold text-black text-sm">{selectedPost?.author?.fullName}</h2>
                           <p className="text-xs text-gray-400">{new Date(selectedPost?.date || selectedPost?.createdAt).toLocaleString()}</p>
                        </div>
                     </div>
                     </NavLink>
                  </div>
                  
                  <span className="text-gray-900 mx-auto">{selectedPost?.caption}</span>
                  
                  <div className="comments border border-zinc-500 mr-1 mb-1 rounded h-[40vh] sm:h-[50vh] w-[98%] overflow-auto mx-auto">
                     {
                        selectedPost?.comments.length === 0 ? (
                           <div className="text-black">No Comments</div>
                        ) : (
                           comment.map((comment) => <Comment key={comment._id} comment={comment} />)
                        )
                     }
                  </div>
                  
                  <div className="flex gap-2 text-gray-200">
                     <input
                        type="text"
                        placeholder="Add a comment..."
                        className="outline-none text-sm w-full bg-slate-900 h-8 py-1 px-2 rounded-lg"
                        value={text}
                        onChange={changeEventHandler}
                     />
                     <button disabled={!text.trim()} onClick={commentHandler} className="rounded px-2 py-1 bg-slate-800 hover:bg-slate-700 cursor-pointer">Post</button>
                  </div>
               </div>
         </DialogContent>
      </Dialog>
   );
};
