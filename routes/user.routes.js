import { Router } from "express";
import { getAllUsers, getUserById } from "../controllers/users.controller.js";
import verify, { restrict } from "../middleware/auth.middleware.js";

const userRouter = Router();

userRouter.get('/', verify, restrict ,getAllUsers);
userRouter.get('/:id', getUserById);

export default userRouter;