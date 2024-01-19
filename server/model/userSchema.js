const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
time:{
    type:String,
    require:true,
  },
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  registration: {
    type: Number,
    require: true,
  },
  center: {
    type: String,
    require: true,
  },
  scanned: {
    type: Boolean,
    require: true,
  },
});

const User = mongoose.model("USER", userSchema);
module.exports = User;
