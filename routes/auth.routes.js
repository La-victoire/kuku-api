import { Router } from "express";
import { editProfile, logOut, signIn, signUp } from "../controllers/auth.controller.js";
import { upload } from "../config/multer.js";

const authRouter = Router();

const imgUploads = upload.fields({
  name: "profile_img", maxCount: 1
});
authRouter.post('/signup', imgUploads,
  signUp);

authRouter.post('/signin', signIn);

authRouter.put('/edit/:id', imgUploads,editProfile);

authRouter.delete('/logout', logOut);

export default authRouter;