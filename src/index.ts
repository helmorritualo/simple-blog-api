import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { jwt } from "hono/jwt";
import { Context, Next } from "hono";
import { cors } from "hono/cors";
import { serveStatic } from "@hono/node-server/serve-static";

import errorHandlerMiddleware from "./middlewares/error-handler";
import { routes } from "./controllers/routes";
import { PORT, JWT_SECRET } from "./config/env";
import connectionToDatabase from "./config/database";

const app = new Hono();

// Middlewares
app.use("*", logger());
app.use(
  "*",
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5500",
      "http://127.0.0.1:5500",
      "http://localhost:8080",
      "http://127.0.0.1:8080",
    ],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    credentials: true,
    maxAge: 600,
  })
);

app.onError(errorHandlerMiddleware);

// Serve static files for uploads
app.use("/uploads/*", serveStatic({ root: "." }));

app.use("/api/v1/*", async (c: Context, next: Next) => {
  const path = c.req.path;

  //* Skip auth routes
  if (path === "/api/v1/auth/login" || path === "/api/v1/auth/register") {
    return next();
  }

  return jwt({
    secret: JWT_SECRET as string,
  })(c, next);
});

// routes
routes.forEach((route) => {
  app.route("/api/v1", route);
});

serve(
  {
    fetch: app.fetch,
    port: Number(PORT) || 3000,
  },
  async (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);

    await connectionToDatabase();
  }
);
