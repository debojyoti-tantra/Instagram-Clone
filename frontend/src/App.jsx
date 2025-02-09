import { useState, useEffect } from 'react';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import MainLayout from './components/MainLayout.jsx';
import Home from './components/Home.jsx';
import Profile from './components/Profile.jsx';
import Search from './components/Search.jsx';
import EditProfile from './components/EditProfile.jsx';
import ProfilePost from './components/ProfilePost.jsx';
import ChatPage from './components/ChatPage.jsx';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import { io } from 'socket.io-client';
import { useSelector, useDispatch } from 'react-redux';
import { setSocket } from './redux/socketSlice.js';
import { setOnlineUsers } from './redux/chatSlice.js';
import { setLikeNotification } from './redux/rtnSlice.js';
import ProtectedRoutes from './components/ProtectedRoutes.jsx';

const browserRouter = createBrowserRouter([
   {
      path:'/',
      element: <ProtectedRoutes><MainLayout /></ProtectedRoutes>,
      children:[
         {
            path:'/',
            element: <ProtectedRoutes><Home /></ProtectedRoutes>
         },
         {
            path:'/profile/:username',
            element: <ProtectedRoutes><Profile /></ProtectedRoutes>
         },
         {
            path:'/profile/:username/:id',
            element: <ProtectedRoutes><ProfilePost /></ProtectedRoutes>
         },
         {
            path:'/account/edit',
            element: <ProtectedRoutes><EditProfile /></ProtectedRoutes>
         },
         {
            path:'/search',
            element: <ProtectedRoutes><Search /></ProtectedRoutes>
         },
         {
            path:'/chatpage',
            element: <ProtectedRoutes><ChatPage /></ProtectedRoutes>
         },
      ]
   },
   {
      path:'/login',
      element:<Login />
   },
   {
      path:'/signup',
      element:<Signup />
   },
])

function App() {
   const dispatch = useDispatch();
   const {user} = useSelector(store=>store.auth);
   const {socket} = useSelector(store=>store.socketio);
   
   useEffect(() => {  
      if (user) {
         const socketio = io('http://localhost:8000', {
            query: {
               userId: user?._id
            },
            transports:['websocket']
         });
         dispatch(setSocket(socketio));
         
         // recive all events which we made in backend
         socketio.on('getOnlineUsers', (onlineUsers) => {
            dispatch(setOnlineUsers(onlineUsers));
         })
         
         socketio.on('notification', (notification) => {
            dispatch(setLikeNotification(notification));
         })
         
         return () => {
            socketio.close();
            dispatch(setSocket(null));
         }
      } else if (socket) {
         socket?.close();
         dispatch(setSocket(null));
      }
   }, [user, dispatch]);
   
   return (
      <>
         <RouterProvider router={browserRouter} />
      </>
   )
}

export default App
