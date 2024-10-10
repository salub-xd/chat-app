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
    getAllUsers
} from '../controllers/UserController';


router.route('/registeruser').post(registerUser);
router.route('/loginuser').post(loginUser);
router.route('/edituser/:id').patch(editUser);
router.route('/deleteuser/:id').delete(deleteUser);
router.route('/auth/google').delete(googleAuth);
router.route('/search/id/:id').get(searchUserById);
router.route('/search/username/:username').get(searchUserByUsername);
router.route('/search/name').get(searchUserByName);
router.route('/users').get(getAllUsers);


export default router;