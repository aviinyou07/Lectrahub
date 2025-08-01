const express = require("express");
const router = express.Router();
const { submitContactForm, getAllMessages, replyToMessage, deleteMessage } = require("../controllers/ContactController");
const auth =require("../middlewares/adminAuth")

router.post("/", submitContactForm);

router.get("/", auth, getAllMessages);
router.put("/:id/reply", auth, replyToMessage);
router.delete("/:id", auth, deleteMessage);

module.exports = router;
