import React from 'react';
import {Outlet} from 'react-router-dom';
import LeftSidebar from './LeftSidebar.jsx'

export default function  MainLayout()  {
   return (
      <div className="flex flex-col-reverse sm:grid grid-cols-[2fr_10fr]">
         <div>
            <LeftSidebar />
         </div>
         <div>
            <Outlet />
         </div>
      </div>
   );
};