import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, 'User FirstName is required'],
    trim: true,
    minLength: 3,
    maxLength: 30,
  },
  lastname: {
    type: String,
    required: [true, 'User LastName is required'],
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
    match: [/\S+@+\S+.\S+/, 'Please fill a valid email address ']
  },
  profile_img: [{
    value: { 
      type: String, 
    }
  }],
  bio: {
    type: String,
    minLength: 10,
    trim: true,
  },
  occupation: {
    type: String,
    minLength: 3
  },
  phone: {
    type: Number,
    minLength: 9, 
    trim: true,
  },
  socials: [{
    github: { type: String},
    twitter: { type: String},
    linkedIn: { type: String},
  }],
  gender: {
    type: String,
    enum: ["male", "female"],
    default: "male"
  },
  address: [{
    city: { type: String },
    state: { type: String },
    country: { type: String },
  }],
  password: {
    type: String,
    required: [true, 'Password is required'],
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