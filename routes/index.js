const account = require("./auth");
const user = require("./user");
const booking = require("./booking");

module.exports = (app) => {
  app.get("/", (req, res) => {
    res.status(200).send({
      message: "Welcome to the Google Calendar API. Register or Login to use APIS.",
    });
  });

  app.use("/api/account", account);
  app.use("/api/user", user);
  app.use("/api/booking", booking);
};
