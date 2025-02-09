import React from "react";
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Input } from './ui/input.jsx';
import { Label } from './ui/label.jsx';
import { Button } from './ui/button.jsx';
import { toast } from 'sonner';
import { NavLink, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import {setAuthUser} from '../redux/authSlice.js'

export default function Login() {
   const navigate = useNavigate();
   const dispatch = useDispatch();
   
   const {user} = useSelector(store=>store.auth);
   useEffect(() => {  
      if (user) {
         navigate('/');
      }
   }, []);
   
   const [input, setInput] = useState({
      username:"",
      password:""
   });
   const [loading, setLoading] = useState(false);
   
   const changeEventHandler = (e) => {
      setInput({...input, [e.target.name]:e.target.value});
   };
   
   const signUpHandler = async (e) => {
      e.preventDefault();
      try {
         setLoading(true);
         const res = await axios.post('https://instadebo.onrender.com/api/v1/user/login', input, {
            header:{
               'Content-Type': 'application/json'
            },
            withCredentials:true
         });
         
         if (res.data.success) {
            dispatch(setAuthUser(res.data.user));
            navigate('/');
            toast.success(res.data.message);
            setInput({
               username:"",
               password:""
            });
         }
      } catch (error) {
         toast.error(error.response.data.message);
      } finally {
         setLoading(false);
      }
   };
   
   return (
      <div className="flex flex-col justify-center items-center min-h-[80vh] bg-black text-white p-4">
         {/* Logo Section */}
         <div className="mb-5">
            <div className="text-3xl font-bold tracking-wide text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 shadow-md">
               InstaDebo
            </div>
         </div>

         {/* Signup Form */}
         <form onSubmit={signUpHandler} className="bg-gray-900 text-white px-8 py-4 rounded-lg shadow-lg w-full max-w-md border border-gray-700">
            <div className="flex justify-center items-center mb-3">
               <div className="logo text-2xl font-semibold underline">Login</div>
            </div>
            <div className="flex flex-col gap-4">
               <div>
                  <Label htmlFor="username" className="font-medium text-gray-400">Username:</Label>
                  <Input
                     className="bg-gray-800 text-white p-2 h-8 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
                     type="text"
                     id="username"
                     name="username"
                     value={input.username}
                     onChange={changeEventHandler}
                  />
               </div>
               <div>
                  <Label htmlFor="password" className="font-medium text-gray-400">Password:</Label>
                  <Input
                     className="bg-gray-800 text-white p-2 h-8 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
                     type="password"
                     id="password"
                     name="password"
                     value={input.password}
                     onChange={changeEventHandler}
                  />
               </div>
               <div className="label-text text-white">
                  Don't have an account?
                  <NavLink to="/signup" className="text-purple-400 underline"> Signup</NavLink>
               </div>
               {
                  loading ? (
                     <Button className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white py-2 px-4 rounded-lg font-semibold shadow-lg transition-transform transform hover:scale-105 w-full">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Please Wait
                     </Button>
                  ) : (
                     <Button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white py-2 px-4 rounded-lg font-semibold shadow-lg transition-transform transform hover:scale-105 w-full">
                        Login
                     </Button>
                  )
               }
            </div>
         </form>

         {/* Footer */}
         <footer className="mt-8 text-sm text-gray-500">
            © 2025 Instadebo. All rights reserved.
         </footer>
      </div>
   );
}
