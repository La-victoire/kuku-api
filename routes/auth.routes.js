import { Router } from "express";
import { editProfile, logOut, signIn, signUp } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post('/signup', signUp);

authRouter.post('/signin', signIn);

authRouter.put('/edit/:id', editProfile);

authRouter.get('/logout', logOut);

export default authRouter;