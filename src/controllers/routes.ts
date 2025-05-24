import authRouter from "./auth/route";
export const routes = [
     authRouter,
];

export type AppRoute = (typeof routes)[number];