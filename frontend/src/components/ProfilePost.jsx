import React, { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import axios from "axios";
import { FaHeart, FaRegHeart, FaCommentDots, FaRegBookmark } from "react-icons/fa";
import { IoBookmarks } from "react-icons/io5";
import { IoIosSend } from "react-icons/io";
import { useSelector, useDispatch } from 'react-redux';
import { setPosts } from '../redux/postSlice.js';
import { toast } from 'sonner';
import Comment from './Comment.jsx';

export default function ProfilePost() {
   const {user} = useSelector(store=>store.auth);
   const {posts} = useSelector(store=>store.post);
   const dispatch = useDispatch();
   const { username, id } = useParams();
   const [post, setPost] = useState({});
   const [loading, setLoading] = useState(true);
   const [liked, setLiked] = useState(false);
   const [postLike, setPostLike] = useState(0);
   const [text, setText] = useState("");
   const [comment, setComment] = useState([]);
   
   useEffect(() => {
      const fetchPost = async () => {
         try {
            const res = await axios.get(`/api/v1/post/${id}`);
            setPost(res.data.post);
            if (res.data.post.likes && user._id) {
               setLiked(res.data.post.likes.includes(user?._id));
               setPostLike(res.data.post.likes.length);
            }
            
         } catch (error) {
            console.error("Error fetching post:", error);
         } finally {
            setLoading(false);
         }
      };

      fetchPost();
   }, [id, user?._id]);
   
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
         const res = await axios.post(`/api/v1/post/${post._id}/comment`, { text }, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
         });
         if (res.data.success) {
            setPost((prevPost) => ({
               ...prevPost,
               comments: [...prevPost.comments, res.data.comment],  // Append the new comment to post state
            }));
   
            // Update Redux store
            const updatedPostData = posts.map((p) => 
               p._id === post._id ? { ...p, comments: [...p.comments, res.data.comment] } : p
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
   
   if (loading) return <p className="text-white text-center mt-5">Loading...</p>;
   if (!post) return <p className="text-red-500 text-center mt-5">Post not found</p>;

   return (
      <div className="grid grid-cols-1 sm:grid-cols-[3fr_2fr] h-[80vh] m-1 p-1">
         <div className="sm:border border-white sm:m-1 sm:p-1 flex flex-col justify-center items-center">
            <NavLink to={`/profile/${post?.author?.username}`} className="sm:hidden flex justify-center items-center gap-2 my-1 py-1 px-5 rounded">
               <img src={post?.author?.profilePicture || 'https://w7.pngwing.com/pngs/247/564/png-transparent-computer-icons-user-profile-user-avatar-blue-heroes-electric-blue.png'} alt="author_image" className="h-6 w-6 rounded-full object-cover" />
               <span className="flex flex-col justify-center items-center">
                  <p>@{post?.author?.username}</p>
               </span>
            </NavLink>
            <span className="sm:hidden">{post?.caption}</span>
            
            <img src={post?.image} alt="post_image" className="h-[62vh] sm:h-[80vh] object-contain" />
         </div>
         <div className="sm:border border-white m-1 px-1 pb-20 sm:p-1">
            <div className="flex flex-col justify-center items-center gap-1 m-1">
               <NavLink to={`/profile/${post?.author?.username}`} className="hidden sm:flex justify-center items-center gap-3 my-1">
                  <img src={post?.author?.profilePicture || 'https://w7.pngwing.com/pngs/247/564/png-transparent-computer-icons-user-profile-user-avatar-blue-heroes-electric-blue.png'} alt="author_image" className="h-10 w-10 rounded-full object-cover" />
                  <span className="flex flex-col justify-center items-center">
                     <p>{post?.author?.fullName}</p>
                     <p>@{post?.author?.username}</p>
                  </span>
               </NavLink>
               <span className="hidden sm:block">{post?.caption}</span>
            </div>
            <div className="w-[90%] mx-auto border border-gray-700 hidden sm:block"></div>
            <div className="flex justify-around items-center p-1 m-1">
               <span className="flex flex-col justify-center items-center">
                  {
                     liked ? <FaHeart onClick={likeDislikeHandler} className="text-red-500 text-2xl" /> : <FaRegHeart onClick={likeDislikeHandler} className="text-2xl" />
                  }
                  <p className="text-xs text-gray-300">
                     {postLike.length === 0 || postLike.length === 1 
                      ? `${postLike} like` 
                      : `${postLike} likes`}
                  </p>
               </span>
               <span className="flex flex-col justify-center items-center">
                  <IoIosSend className="text-2xl" />
                  <p className="text-xs text-gray-300">Send</p>
               </span>
               <span className="flex flex-col justify-center items-center">
                  <IoBookmarks onClick={bookmarkHandler} className="text-2xl" />
                  <p className="text-xs text-gray-300">Bookmark</p>
               </span>
            </div>
            <div className="w-[90%] mx-auto border border-gray-700"></div>
            <span className="flex justify-center sm:hidden">Comments</span>
            <div className="border border-white rounded h-[40vh] sm:h-[52vh] w-full overflow-auto py-1 px-2 mb-2">
               {
                  post.comments.length === 0 ? (
                     <div className="flex justify-center items-center">No Comments Yet</div>
                  ) : (
                     post.comments.map((comment) => <Comment key={comment._id} comment={comment} />)
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
      </div>
   );
}