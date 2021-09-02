const user = require("../models/user");
const { User } = require("../models/user");

class UserService {
  async saveUser(user) {
    const UserObj = new User(user);
    return await UserObj.save();
  }
  async matchToken(token, email) {
    const user = await User.find({
      $and: [{ token: token }, { email: email }],
    });
    if (!user) return false;
    return user;
  }
  async findUserByEmail(email) {
    return await User.findOne({ email: email });
  }
  async getUserById(userId) {
    const user = await User.findById(userId);
    if (!user) return false;
    return user;
  }
  async getAllUser() {
    const users = await User.find({},{token:0, password: 0});
    if (!users) return false;
    return users;
  }
  async updateUser(user, _id) {
    if (_id) {
      const userInfo = await User.findById(_id);
      if (userInfo) user = Object.assign(userInfo, user);
    }
    const userObj = new User(user);
    return await userObj.save();
  }
}

module.exports = new UserService();
