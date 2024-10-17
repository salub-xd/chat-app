import express from "express";
const router = express.Router();

import {
    messages
} from '../controllers/MessageController';
import verify from "../middleware/verify";


router.route('/messages').get(messages);


export default router;