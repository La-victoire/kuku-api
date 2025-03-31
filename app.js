import express from "express";
// import fileUpload from "express-fileupload"
import { JWT_SECRET, NODE_ENV, PORT } from './config/env.js'
import connectDataBase from "./database/mongodb.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/posts.routes.js";
import errorMiddleware from "./middleware/error.middleware.js";
import cors from "cors"
import cookieParser from "cookie-parser";
import session from "express-session";
import jwt from "jsonwebtoken";
import cloudinary from "./config/cloudinary.js";
import streamifier from "streamifier"
import { upload } from "./config/multer.js";

const app = express()

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cors({origin:["http://localhost:3000","https://kukus-blog.vercel.app"],credentials:true}));
app.use(cookieParser());
app.use(errorMiddleware);

app.use('/v1/auth', authRouter);
app.use('/v1/users', userRouter);
app.use('/v1/posts', postRouter);


app.get('/', (req,res) => (
  res.send("Welcome to KUKU's BLOG")
))
connectDataBase()

 export const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({folder: "blog_uploads"}, (err, result) => {
      if (err) {return reject(err);}
      resolve (result);
    })
    streamifier.createReadStream(buffer).pipe(stream)
    setTimeout(() => reject(new Error("Cloudinary upload timed out")), 30000); // 30s timeout
  })
}


app.listen(PORT, async ()=> {
  console.log(`App running on ${NODE_ENV} mode`)
})

// Minimal test route using diskStorage for debugging
import multer from "multer";

// Configure diskStorage temporarily to see if files are being saved
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Ensure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const testUpload = multer({ storage });

app.post("/test-upload", testUpload.single("coverImage"), (req, res) => {
  console.log("Test Route req.file:", req.file);
  res.json({ message: "Test route", file: req.file });
});
