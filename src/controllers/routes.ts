import authRouter from "./auth/route";
import userRouter from "./user/route";
import blogPostRouter from "./blog-post/route";
import commentRouter from "./comment/route";

export const routes = [
  authRouter,
  userRouter,
  blogPostRouter,
  commentRouter,
];

export type AppRoute = (typeof routes)[number];
