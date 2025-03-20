import express from "express";
import fileUpload from "express-fileupload"
import { JWT_SECRET, PORT } from './config/env.js'
import connectDataBase from "./database/mongodb.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/posts.routes.js";
import errorMiddleware from "./middleware/error.middleware.js";
import cors from "cors"
import cookieParser from "cookie-parser";
import session from "express-session";
import jwt from "jsonwebtoken";

const app = express()

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors({origin:"http://localhost:3000",credentials: true,}));
app.use(session({
  secret: JWT_SECRET,
  resave:false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 24*60*60*1000
  }
}));
app.use(errorMiddleware);
app.use(fileUpload());

app.use('/v1/auth', authRouter);
app.use('/v1/users', userRouter);
app.use('/v1/posts', postRouter);


app.get('/', (req,res) => (
  res.send("Welcome to KUKU's BLOG")
))
connectDataBase()

app.listen(PORT, ()=> {
  console.log(`App running on http//localhost:${PORT}`)
})