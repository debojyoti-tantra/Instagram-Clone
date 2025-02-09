import React from 'react';
import Feed from './Feed.jsx';
import {Outlet} from 'react-router-dom';
import useGetAllPost from '../hooks/useGetAllPost.jsx';

export default function  Home()  {
   useGetAllPost();
   
   return (
      <div>
         <Feed />
         <Outlet />
      </div>
   );
};