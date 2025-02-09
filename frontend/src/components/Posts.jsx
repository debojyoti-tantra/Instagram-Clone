import React from "react";
import Post from './Post.jsx';
import { useSelector, useDispatch } from 'react-redux';

export default function Posts() {
   const {posts} = useSelector(store=>store.post);
   
   return (
      <div className="flex flex-col gap-2">
         {
            posts.map((post) => <Post key={post._id} post={post} />)
         }
      </div>
   );
}
