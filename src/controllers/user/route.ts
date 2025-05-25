import { Hono } from "hono";
import {
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
} from "./user.controller";
import {
  validateUserUpdate,
  validateUpdatePassword,
} from "@/middlewares/user-validator";
import authenticate from "@/middlewares/authentication";
import { handleProfilePictureUpload } from "@/middlewares/file-upload";

const userRouter = new Hono();

userRouter.get("/users/profile", authenticate, getUserProfile);
userRouter.put(
  "/users/profile",
  authenticate,
  handleProfilePictureUpload,
  validateUserUpdate,
  updateUserProfile
);
userRouter.patch(
  "/users/password",
  authenticate,
  validateUpdatePassword,
  updateUserPassword
);

export default userRouter;
