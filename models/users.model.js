import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, 'User Name is required'],
    trim: true,
    minLength: 3,
    maxLength: 30,
  },
  lastname: {
    type: String,
    required: [true, 'User Name is required'],
    trim: true,
    minLength: 3,
    maxLength: 30,
  },
  username: {
    type: String,
    trim: true,
    minLength: 5,
    maxLength: 30,
  },
  email: {
    type: String,
    required: [true, 'User Email is required'],
    trim: true,
    unique: true,
    lowercase: true,
    match: [/\S+@+\S+.\S+/, 'Please fill a valid email address ']
  },
  profile_img: [{
    value: { 
      type: String, 
      required: true 
    }
  }],
  bio: {
    type: String,
    minLength: 10,
    maxLength: 100,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'User Email is required'],
    trim: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["user","admin"],
    default: "user",
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    index: true
  }
}, {timestamps: true });

const User = mongoose.model('User', userSchema) 

export default User;