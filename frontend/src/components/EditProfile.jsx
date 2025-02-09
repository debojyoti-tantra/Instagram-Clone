import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from './ui/button.jsx';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { setAuthUser } from '../redux/authSlice.js';

export default function EditProfile() {
   const imageRef = useRef();
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const { user } = useSelector((store) => store.auth);
   
   const [loading, setLoading] = useState(false);
   const [input, setInput] = useState({
      profilePicture: user?.profilePicture,
      bio: user?.bio,
      gender: user?.gender
   });
   
   const handleProfilePictureChange = (e) => {
      const file = e.target.files[0];
      if (file) {
         setInput({...input, profilePicture:file});
      }
   };

   // Handle form submission
   const handleSubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append("bio", input?.bio);
      formData.append("gender", input?.gender);
      if (input.profilePicture) {
         formData.append("profilePicture", input?.profilePicture);
      }
      try {
         setLoading(true);
         const res = await axios.post('http://localhost:8000/api/v1/user/profile/edit', formData, {
            headers: {
               'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
         });
         
         if (res.data.success) {
            const updatedUserData = {
               ...user,
               bio: res.data.user?.bio,
               profilePicture: res.data.user?.profilePicture,
               gender: res.data.user?.gender
            }
            
            dispatch(setAuthUser(updatedUserData));
            navigate(`/profile/${user?.username}`);
            toast.success(res.data.message);
         }
      } catch (error) {
         console.log(error);
         toast.error(error.response.data.message);
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="max-w-2xl mx-auto m-4 p-6 bg-gray-900 rounded-lg shadow-lg">
         <h2 className="text-2xl font-bold text-white mb-5">Edit Profile</h2>

         {/* Profile Picture */}
         <div className="flex gap-4 items-center gap-6 mb-5 bg-slate-800 p-2 rounded">
            <img
               src={input?.profilePicture || "https://w7.pngwing.com/pngs/247/564/png-transparent-computer-icons-user-profile-user-avatar-blue-heroes-electric-blue.png"}
               alt="Profile"
               className="w-28 h-28 rounded-full border-4 border-gray-700 hover:opacity-80 object-cover"
            />
            <input ref={imageRef} type="file" className="hidden" accept="image/*" onChange={handleProfilePictureChange} />
            <Button onClick={() => imageRef?.current.click()} className="bg-blue-500 hover:bg-blue-700">Change Photo</Button>
         </div>

         {/* Bio Input */}
         <div className="mb-5">
            <label className="block text-gray-400 text-sm mb-1">Bio</label>
            <textarea
               value={input?.bio}
               onChange={(e) => setInput({...input, bio:e.target.value})}
               className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
               rows="3"
               placeholder="Write something about yourself..."
            />
         </div>

         {/* Gender Selection */}
         <div className="mb-5">
            <label className="block text-gray-400 text-sm mb-1">Gender</label>
            <select
               value={input?.gender}
               onChange={(e) => setInput({...input, gender:e.target.value})}
               className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
               <option value="">Select Gender</option>
               <option value="male">Male</option>
               <option value="female">Female</option>
            </select>
         </div>

         {/* Save Changes Button */}
         {
            loading ? <button
               className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition flex justify-center items-center"
            >
               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
               Please Wait
            </button> : <button
               onClick={handleSubmit}
               className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
               Save Changes
            </button>
         }
      </div>
   );
}  