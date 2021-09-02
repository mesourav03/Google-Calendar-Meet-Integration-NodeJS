const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cryptoRandomString = require("crypto-random-string");


const UserSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String },
  email: { type: String, required: true },
  profile_image: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: [0, 1, 2, 3, 4] },
  token: {
    type: String,
    default: cryptoRandomString({ length: 25, type: "base64" }),
  },
  availableDates: {type: Array, default: []},
  updated_at: { type: Date, default: Date.now },
});

UserSchema.statics.hashPassword = async function (password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};
UserSchema.statics.comparePassword = async function (password, dbPassword) {
  return bcrypt.compareSync(password, dbPassword);
};
UserSchema.statics.createPayload = async function (user) {
  const payload = {
    id: user._id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    role: user.role,
  };
  return payload;
};

const User = mongoose.model("User", UserSchema, "User");

module.exports = { User };
