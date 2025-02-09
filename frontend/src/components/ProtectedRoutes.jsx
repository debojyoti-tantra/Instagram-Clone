import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function  ProtectedRoutes({children})  {
   const navigate = useNavigate();
   const {user} = useSelector(store=>store.auth);
   
   useEffect(() => {  
      if (!user) {
         navigate('/login');
      }
   }, []);
   
   return <>{children}</>
};
