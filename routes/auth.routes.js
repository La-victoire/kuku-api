import { Router } from "express";
import { editProfile, logOut, signIn, signUp } from "../controllers/auth.controller.js";
import { upload } from "../config/multer.js";

const authRouter = Router();

authRouter.post('/signup',
  upload.fields({
    name: "profile_img", maxCount : 1
  }),
  signUp);

authRouter.post('/signin', signIn);

authRouter.put('/edit/:id', editProfile);

authRouter.get('/logout', logOut);

export default authRouter;