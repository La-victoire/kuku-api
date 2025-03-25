import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Subscription name is required'],
    minLength: 2,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Subscription name is required'],
    minLength: 3,
    maxLength: 60,
    trim: true
  },
  coverImage: [
    {
    value:{
    type: String,
    default: "COVER-IMAGE"
  }
  }],
  tag: {
    type: String,
    minLength: 2,
    maxLength: 15,
    trim: true  
  },
  categories: {
    type: String,
    trim: true,
    minLength: 3,
    required: [true, 'Subscription name is required'],
  },
  content: [
    {
      type: { 
        type: String, 
        enum: ["text", "image"], 
        required: true 
      },
      value: { 
        type: String, 
        required: true 
      } // Holds text content or Cloudinary image URL
    }
  ],
  comments: [{ body: String, date: Date }],
  date: { type: Date, default: Date.now },
  hidden: Boolean,
  meta: {
    likes: Number,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Subscription name is required'],
    index: true
  }
}, {timestamps: true});

const Posts = mongoose.model('Posts', postSchema);

export default Posts;
