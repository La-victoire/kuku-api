import express from "express";
import fileUpload from "express-fileupload"
import { PORT } from './config/env.js'
import connectDataBase from "./database/mongodb.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/posts.routes.js";
import errorMiddleware from "./middleware/error.middleware.js";
import cors from "cors"


const app = express()

app.use(express.json());
app.use(cors())
app.use(errorMiddleware);
app.use(fileUpload());

app.use('/v1/auth', authRouter);
app.use('/v1/users', userRouter);
app.use('/v1/posts', postRouter);


app.get('/', (req,res) => (
  res.send('Welcome')
))

connectDataBase()

app.listen(PORT, ()=> {
  console.log(`App running on http//localhost:${PORT}`)
})