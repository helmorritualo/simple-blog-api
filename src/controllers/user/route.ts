import { Hono } from "hono";
import { getUserProfile, updateUserProfile, updateUserPassword } from "./user.controller";
import { validateUserUpdate, validateUpdatePassword } from "@/middlewares/user-validator";
import authenticate from "@/middlewares/authentication";

const userRouter = new Hono();

userRouter.get("/users/profile", authenticate, getUserProfile);
userRouter.put("/users/profile", authenticate, validateUserUpdate, updateUserProfile);
userRouter.patch("/users/password", authenticate, validateUpdatePassword, updateUserPassword);

export default userRouter;