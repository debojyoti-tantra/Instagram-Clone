import { User } from '../models/userModel.js';
import { Post } from '../models/postModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
   try {
      const {fullName, username, email, password} = req.body;
      if (!fullName || !username || !email || !password) {
         return res.status(401).json({
            message:"All fields are required!",
            success:false
         });
      }
      const user = await User.findOne({username});
      if (user) {
         return res.status(401).json({
            message:"This username already exist please try different.",
            success:false
         });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({
         fullName,
         username,
         email,
         password:hashedPassword
      });
      return res.status(201).json({
         message:"Account created successfully",
         success:true
      });
   } catch (error) {
      console.log(error);
   }
};

export const login = async (req, res) => {
   try {
      const {username, password} = req.body;
      if (!username || !password) {
         return res.status(401).json({
            message:"All fields are required!",
            success:false
         });
      }
      let user = await User.findOne({username});
      if (!user) {
         return res.status(401).json({
            message:"Incorrect username!",
            success:false
         });
      }
      const isPasswordMatched = await bcrypt.compare(password, user.password);
      if (!isPasswordMatched) {
         return res.status(401).json({
            message:"Incorrect password!",
            success:false
         });
      }
      const token = await jwt.sign({userId:user._id}, process.env.JWT_SERECT_KEY, {expiresIn:'1d'});
      // populate each post in the post array
      const populatedPost = await Promise.all(
         user.posts.map( async (postId) => {
            const post = await Post.findById(postId);
            if (post.author.equals(user._id)) {
               return post;
            }
            return null;
         })
      )
      
      user = {
         _id: user._id,
         fullName: user.fullName,
         username: user.username,
         email: user.email,
         profilePicture: user.profilePicture,
         bio: user.bio,
         followers: user.followers,
         following: user.following,
         posts: populatedPost
     }
      return res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 }).json({
         message:`Wellcome back ${user.fullName}`,
         success:true,
         user
      });
      
   } catch (error) {
      console.log(error);
   }
};

export const logout = async (req, res) => {
   try {
      return res.cookie("token", "", { maxAge: 0 }).json({
         message: 'Logged out successfully.',
         success: true
      });
   } catch (error) {
      console.log(error);
   }
};

export const getProfile = async (req, res) => {
   try {
      const username = req.params.username; // Fetch username from URL
      let user = await User.findOne({ username })
         .populate({
            path: 'posts',
            options: { sort: { createdAt: -1 } }, // Sorting posts by createdAt
            populate: {
               path: 'comments', // Populate comments inside posts
               options: { sort: { createdAt: -1 } }, // Sorting comments by createdAt
               populate: { path: 'author', select: 'username profilePicture' } // Populate author details of comments
            }
         })
         .populate({
            path: 'bookmarks',
            options: { sort: { createdAt: -1 } }
         })
         .select("-password");

      if (!user) {
         return res.status(404).json({
            message: "User not found",
            success: false
         });
      }

      return res.status(200).json({
         user,
         success: true
      });
   } catch (error) {
      console.log(error);
   }
};

export const editProfile = async (req, res) => {
   try {
      const userId = req.id;
      const {bio, gender} = req.body;
      const profilePicture = req.file;
      let cloudResponse;
      
      if (profilePicture) {
         const fileUri = getDataUri(profilePicture);  // we use getDataUri() function for get the uri for file we upload
         cloudResponse = await cloudinary.uploader.upload(fileUri);
      }
      
      const user = await User.findById(userId).select("-password");
      if (!user) {
         return res.status(404).json({
            message:'user not found',
            success:false
         });
      }
      
      if(bio) user.bio = bio;
      if(gender) user.gender = gender;
      if (profilePicture) user.profilePicture = cloudResponse.secure_url;
      
      await user.save();
      
      return res.status(200).json({
         message:'profile updated successfully.',
         success:true,
         user
      });
      
   } catch (error) {
      console.log(error);
   }
};

export const getSuggestedUsers = async (req, res) => {
   try {
      const suggestedUsers = await User.find({_id:{$ne:req.id}}).select("-password");
      if (!suggestedUsers) {
         return res.status(400).json({
            message:'currently do not have any users.',
            success:false
         });
      }
      return res.status(200).json({
         success:true,
         users:suggestedUsers
      });
      
   } catch (error) {
      console.log(error);
   }
};

export const followOrUnfollow = async (req, res) => {
   try {
      const followKrneWala = req.id; // me
      const jiskoFollowKrunga = req.params.id; // other user

      if (followKrneWala === jiskoFollowKrunga) {
         return res.status(400).json({
            message: 'You cannot follow/unfollow yourself',
            success: false
         });
      }

      const user = await User.findById(followKrneWala);
      const targetUser = await User.findById(jiskoFollowKrunga);

      if (!user || !targetUser) {
         return res.status(400).json({
            message: 'User not found',
            success: false
         });
      }

      // check if following
      const isFollowing = user.following.includes(jiskoFollowKrunga);

      if (isFollowing) {
         // Unfollow
         await Promise.all([
            User.updateOne({ _id: followKrneWala }, { $pull: { following: jiskoFollowKrunga } }),
            User.updateOne({ _id: jiskoFollowKrunga }, { $pull: { followers: followKrneWala } }),
         ]);
      } else {
         // Follow
         await Promise.all([
            User.updateOne({ _id: followKrneWala }, { $push: { following: jiskoFollowKrunga } }),
            User.updateOne({ _id: jiskoFollowKrunga }, { $push: { followers: followKrneWala } }),
         ]);
      }

      // 🔹 Fetch updated user after changes
      const updatedUser = await User.findById(followKrneWala).select('-password');  

      return res.status(200).json({
         message: isFollowing ? 'Unfollowed successfully' : 'Followed successfully',
         isFollowing,
         success: true,
         updatedUser,  // ✅ Send updated user
      });

   } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error", success: false });
   }
};

export const getFollowers = async (req, res) => {
   try {
      const { id } = req.params;
      const user = await User.findById(id).populate({
         path: "followers",
         select: "fullName username profilePicture"
      });

      if (!user) {
         return res.status(404).json({
            message: "User not found",
            success: false
         });
      }

      return res.status(200).json({
         success: true,
         followers: user.followers // Populated followers
      });
   } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error", success: false });
   }
};

export const getFollowing = async (req, res) => {
   try {
      const { id } = req.params;
      const user = await User.findById(id).populate({
         path: "following",
         select: "fullName username profilePicture"
      });

      if (!user) {
         return res.status(404).json({
            message: "User not found",
            success: false
         });
      }

      return res.status(200).json({
         success: true,
         following: user.following // Populated following users
      });
   } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error", success: false });
   }
};