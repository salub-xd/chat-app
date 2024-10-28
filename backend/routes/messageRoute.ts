import express from "express";
const router = express.Router();

import {
    markMessagesAsSeen,
    messages,
    userContact
} from '../controllers/MessageController';
import verify from "../middleware/verify";


router.route('/messages').get(verify,messages);
router.route('/userContacts/:id').get(verify,userContact);
router.route('/messages/mark-seen/:id').post(verify,markMessagesAsSeen);


export default router;