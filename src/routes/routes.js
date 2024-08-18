const {userLogin,googlesignin} = require("../Controllers/userLogin");
const {getUserQuery} = require("../Controllers/profile");;
const {sendMessage,getConversations,getChat,}= require('../Controllers/Chat');
const express = require("express");
const { auth } = require("../middleware/auth");
const router = express.Router();


router.post("/login", userLogin);
router.post("/signingoogle",googlesignin);
router.post('/getchat',auth,getChat);
router.get('/conversation',auth,getConversations);
router.post('/message',auth,sendMessage);
router.get('/getNewUsers',getUserQuery);


module.exports = router;
