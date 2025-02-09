import express from 'express';
import { register, login, logout, getProfile, editProfile, getSuggestedUsers, followOrUnfollow, getFollowers, getFollowing } from '../controllers/userController.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
// router.route('/:id/profile').get(isAuthenticated, getProfile);
router.route('/:username/profile').get(isAuthenticated, getProfile);
router.route('/profile/edit').post(isAuthenticated, upload.single('profilePicture'), editProfile);
router.route('/suggested').get(isAuthenticated, getSuggestedUsers);
router.route('/followOrUnfollow/:id').get(isAuthenticated, followOrUnfollow);
router.route('/:id/followers').get(isAuthenticated, getFollowers);
router.route('/:id/following').get(isAuthenticated, getFollowing);

export default router;