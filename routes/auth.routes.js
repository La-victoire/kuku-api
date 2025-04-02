import { Router } from "express";
import { editProfile, logOut, signIn, signUp } from "../controllers/auth.controller.js";
import { upload } from "../config/multer.js";

const authRouter = Router();

const imgUploads = upload.single("profile_img");
authRouter.post('/signup', imgUploads,
  signUp);

authRouter.post('/signin', signIn);

authRouter.put('/edit/:id', imgUploads,editProfile);

authRouter.delete('/logout', logOut);

export default authRouter;