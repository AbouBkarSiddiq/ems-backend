import mongoose from "mongoose";

let userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  imageUrl: {
    type: String,
  }
}, { timestamps: true })

userSchema.index({ username: 1 }, { unique: false }); // Tried as a solution to an error

const User = mongoose.model('User', userSchema);

export default User;

