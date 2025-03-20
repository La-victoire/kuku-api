import { Router } from "express";
import { logOut, session, signIn, signUp } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post('/signup', signUp);

authRouter.post('/signin', signIn);

authRouter.post('/setsession', session );

authRouter.get('/logout', logOut);

export default authRouter;