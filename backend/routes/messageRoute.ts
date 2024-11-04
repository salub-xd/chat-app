import express from "express";
const router = express.Router();

import {
    conversation,
    getConversations,
    getMessages,
    markMessagesAsSeen,
    messages,
    userContact
} from '../controllers/MessageController';
import verify from "../middleware/verify";


router.route('/conversation').post(conversation);
router.route('/getConversations').get(verify, getConversations);
router.route('/getMessages').get(verify, getMessages);
router.route('/messages').get(verify, messages);
router.route('/userContacts/:id').get(verify, userContact);
router.route('/messages/mark-seen/:id').post(verify, markMessagesAsSeen);


export default router;