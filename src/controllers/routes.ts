import authRouter from "./auth/route";
import userRouter from "./user/route";
import blogPostRouter from "./blog-post/route";

export const routes = [authRouter, userRouter, blogPostRouter];

export type AppRoute = (typeof routes)[number];
