const express = require("express");
const router = express.Router();

const BookingController = require("../controllers/booking");

router.post("/bookmentor", BookingController.bookMentor.bind(BookingController));
module.exports = router;
