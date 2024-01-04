const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  name: { type: String, require: true },
  email: { type: String, require: true },
  password: { type: String, require: true },
  role: {
    type: String,
    default: "visitor",
  },
});
const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;
