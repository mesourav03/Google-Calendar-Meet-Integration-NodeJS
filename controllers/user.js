const Response = require("../middlewares/response");
const { User } = require("../models/user");
const UserServices = require("../services/authServices");
const { v4: uuidv4 } = require("uuid");


class UserController {
  constructor() {}

  async getAllUsers(req, res) {
    try {
      const result = await UserServices.getAllUser();
      if (result) {
        result.token = undefined
        result.password = undefined
        const response = new Response(1, "User list", "", "", { users: result });
        return res.status(200).send(response);
      }
      const response = new Response(1, "User list", "", "", {});
      return res.status(200).send(response);
    } catch (error) {
      const response = new Response(0, "Unexpected Error", 0, error, {});
      return res.status(400).send(response);
    }
  }
  async addMySlot(req, res) {
    const { _id, timeSlotStart,timeSlotEnd } = req.body;
    try {
      const result = await UserServices.getUserById(_id);
      if (result) {
        result.availableDates.push({
          timeSlotStart: timeSlotStart,
          timeSlotEnd : timeSlotEnd,
          slotId: uuidv4()
        })
        const userUpdated = await UserServices.updateUser(result, _id);
        if(userUpdated){
          const response = new Response(1, "Time Slot added successfully", "", "", {});
          return res.status(200).send(response);
        }
      }
      const response = new Response(1, "User list", "", "", {});
      return res.status(200).send(response);
    } catch (error) {
      console.log(error)
      const response = new Response(0, "Unexpected Error", 0, error, {});
      return res.status(400).send(response);
    }
  }
}

module.exports = new UserController();