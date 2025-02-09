import React from "react";
import Posts from './Posts.jsx';

export default function Feed() {
 return (
      <div className="flex justify-center bg-black sm:m-3 sm:p-3 h-[83vh] overflow-auto">
         <Posts />
      </div>
   );
}
