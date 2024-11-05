import express from "express";
const router = express.Router();

import {
    deleteUser,
    editUser,
    googleAuth,
    loginUser,
    registerUser,
    searchUserById,
    searchUserByUsername,
    searchUserByName,
    getAllUsers,
    userDetails
} from '../controllers/UserController';
import verify from "../middleware/verify";


router.route('/registeruser').post(registerUser);
router.route('/loginuser').post(loginUser);
router.route('/auth/google').post(googleAuth);
router.route('/edituser/:id').patch(verify,editUser);
router.route('/deleteuser/:id').delete(verify,deleteUser);
router.route('/search/id/:id').get(verify,searchUserById);
router.route('/search/username/:username').get(verify,searchUserByUsername);
router.route('/search/name').get(verify,searchUserByName);
router.route('/users').get(verify,getAllUsers);
router.route('/userDetails').get(verify,userDetails);


export default router;