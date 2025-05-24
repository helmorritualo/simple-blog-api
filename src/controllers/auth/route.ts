import { login, register } from "./auth.controller";
import { Hono } from "hono";
import { validateLogin, validateRegister } from "@/middlewares/auth-validator";

const authRouter = new Hono();
authRouter.post("/auth/register", validateRegister, register);
authRouter.post("/auth/login", validateLogin, login);

export default authRouter;