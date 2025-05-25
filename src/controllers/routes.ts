import authRouter from "./auth/route";
import userRouter from "./user/route";
export const routes = [
     authRouter,
     userRouter,
];

export type AppRoute = (typeof routes)[number];