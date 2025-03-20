import { Router } from "express";
import { getAllUsers, getUserById } from "../controllers/users.controller.js";
import ordinaryRestriction, { adminRestriction } from "../middleware/auth.middleware.js";

const userRouter = Router();

userRouter.get('/', getAllUsers);
userRouter.get('/:id', getUserById);

export default userRouter;