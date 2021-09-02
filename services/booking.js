const user = require("../models/user");

// Require google from googleapis package.
const { google } = require("googleapis");
const { async } = require("crypto-random-string");

// Require oAuth2 from our google instance.
const { OAuth2 } = google.auth;

// Create a new instance of oAuth and set our Client ID & Client Secret.
const oAuth2Client = new OAuth2("Your CLIENT_ID", "Your SECRET_ID");
oAuth2Client.setCredentials({
  refresh_token: "Your Refresh Token",
});

class BookingService {
  async addCalendarEvent(eventStartTime, eventEndTime, name) {
    const event = {
      summary: `Booking with ${name}`,
      colorId: 1,
      start: {
        dateTime: new Date(eventStartTime),
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: new Date(eventEndTime),
        timeZone: "Asia/Kolkata",
      },
      attendees: [{ email: "sharmasourav855@gmail.com" }],
      conferenceData: {
        createRequest: { requestId: "7qxalsvy0e" },
        conferenceSolutionKey: {
          type: "hangoutsMeet",
        },
      },
    };
    const calendar = await google.calendar({ version: "v3", auth: oAuth2Client });
    try {
      if (calendar) {
        calendar.freebusy.query(
          {
            resource: {
              timeMin: new Date(eventStartTime),
              timeMax: new Date(eventEndTime),
              timeZone: "Asia/Kolkata",
              items: [{ id: "primary" }],
            },
          },
          async (err, res) => {
            // Check for errors in our query and log them if they exist.
            if (err) return err;

            // Create an array of all events on our calendar during that time.
            const eventArr = res.data.calendars.primary.busy;

            // Check if event array is empty which means we are not busy
            if (eventArr.length === 0)
              // If we are not busy create a new calendar event.
              calendar.events.insert(
                {
                  calendarId: "primary",
                  resource: event,
                  sendUpdates: "all",
                  conferenceDataVersion: 1,
                },
                function (err, event) {
                  if (err) {
                    console.log("There was an error contacting the Calendar service: " + err);
                    return;
                  }
                  console.log("Event created");
                }
              );
            // If event array is not empty log that we are busy.
            return false;
          }
        );
        return true;
      }
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = new BookingService();
