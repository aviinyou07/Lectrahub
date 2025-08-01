const express = require("express");
const router = express.Router();
const { subscribeUser, getAllSubscribers } = require("../controllers/SubscriberController");

router.post("/subscribe", subscribeUser);
router.get("/subscribers", getAllSubscribers);

module.exports = router;
