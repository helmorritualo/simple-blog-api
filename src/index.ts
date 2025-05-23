import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';

import errorHandlerMiddleware from './middlewares/error-handler';

const app = new Hono();

app.use('*', logger());
app.use("*", cors({
  origin: ["*"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
  credentials: true,
  maxAge: 600
}));
app.onError(errorHandlerMiddleware);

app.get('/', (c) => {
  return c.text('Hello Hono!')
});

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
});
