import { Router } from "express";
import { getAllUsers, getUserById } from "../controllers/users.controller.js";
import { adminRestriction } from "../middleware/auth.middleware.js";

const userRouter = Router();

userRouter.get('/', adminRestriction ,getAllUsers);
userRouter.get('/:id', getUserById);

export default userRouter;