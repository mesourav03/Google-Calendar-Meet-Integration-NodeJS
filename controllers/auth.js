const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const randomstring = require("randomstring");
const Response = require("../middlewares/response");
const authServices = require("../services/authServices");

class UserController {
  constructor() {}
  async createAccount(req, res) {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email: email });
      if (user) {
        const response = new Response(0, "Error in creating user", 101, "User already exists", {});
        return res.status(200).send(response);
      }
      const hashedPassword = await User.hashPassword(password);
      req.body.password = hashedPassword;
      const userCreated = await authServices.saveUser(req.body);
      if (!userCreated) {
        const response = new Response(0, "Error in creating user", 101, "Error creating user", {});
        return res.status(200).send(response);
      }
      const payload = await User.createPayload(userCreated);
      let token = jwt.sign(payload, process.env.SECRET);
      const response = new Response(1, "User account created", "", "", {
        access_token: token,
      });
      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      const response = new Response(0, "Unexpected Error", 0, error, {});
      return res.status(400).send(response);
    }
  }
  async logIn(req, res) {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        const response = new Response(0, "Error in user login", 101, "User does not exist", {});
        return res.status(200).send(response);
      }
      if (bcrypt.compareSync(password, user.password)) {
        const payload = await User.createPayload(user);
        let token = jwt.sign(payload, process.env.SECRET);
        const response = new Response(1, "User loggedIn successfully", "", "", {
          access_token: token,
        });
        return res.status(200).send(response);
      } else {
        const response = new Response(0, "Error in LogIn user", 101, "Wrong Password. Try Again", {});
        return res.status(200).send(response);
      }
    } catch (error) {
      console.log(error);
      const response = new Response(0, "Unexpected Error", 0, error, {});
      return res.status(400).send(response);
    }
  }
  async updatePassword(req, res) {
    const userId = req.params.userId || req.userId;
    const { token, email, currentPassword, newPassword } = req.body;
    try {
      if (currentPassword) {
        const user = await authServices.getUserById(userId);
        if (!user) return res.json({ error: "User does not exist!" });
        if (bcrypt.compareSync(currentPassword, user.password)) {
          const hashedPassword = await bcrypt.hash(newPassword, 10);
          user.password = hashedPassword;
          const updated = await user.save();
          if (updated) {
            const response = new Response(1, "Password updated successfully", "", "", {});
            return res.status(200).send(response);
          }
        } else {
          const response = new Response(0, "Error in updating password", 101, "Wrong Password. Try Again", {});
          return res.status(200).send(response);
        }
      }
      if (token) {
        const user = await authServices.findUserByEmail(email);
        if (!user) return res.json({ error: "User does not exist!" });
        const matched = authServices.matchToken(email, token);
        if (matched) {
          const hashedPassword = await User.hashPassword(newPassword);
          user.password = hashedPassword;
          const updated = await authServices.saveUser(user, user._id);
          updated.guest_user = undefined;
          updated.password = undefined;
          if (updated) {
            const response = new Response(1, "Password updated successfully", "", "", { user: updated });
            return res.status(200).send(response);
          }
        }
        const response = new Response(0, "Error in updating password", 101, "token is incorrect", {});
        return res.status(200).send(response);
      }
      const response = new Response(0, "Error in updating password", 101, "Incorrect data", {});
      return res.status(504).send(response);
    } catch (error) {
      console.log(error);
      const response = new Response(0, "Unexpected Error", 0, error, {});
      return res.status(504).send(response);
    }
  }
}

module.exports = new UserController();
