const Response = require("../middlewares/response");
const bookingService = require("../services/booking");

class BookingController {
  constructor() {}
  async bookMentor(req, res) {
    const { eventStartTime, eventEndTime, name } = req.body;
    try {
      const booking = await bookingService.addCalendarEvent(eventStartTime,eventEndTime, name);
      if (booking) {
        const response = new Response(1, "Booked Successfully", "", "", {});
        return res.status(200).send(response);
      }
    } catch (error) {
      const response = new Response(0, "Unexpected Error", 0, error, {});
      return res.status(200).send(response);
    }
  }
}

module.exports = new BookingController();