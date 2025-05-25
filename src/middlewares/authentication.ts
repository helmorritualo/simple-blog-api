import {
  UnauthorizedError,
  NotFoundError,
  ForbiddenError,
} from "@/utils/error";
import { Context, Next } from "hono";
import { verify } from "hono/jwt";
import { JWT_SECRET } from "@/config/env";
import getUserByIdService from "@/services/user.service";

const authenticate = async (c: Context, next: Next) => {
  try {
    const token = extractTokenFromHeader(c);

    const payload = await verifyToken(token);

    await validateUser(payload.user_id);

    setupAuthContext(c, payload);

    await next();
  } catch (error) {
    if (
      error instanceof UnauthorizedError ||
      error instanceof NotFoundError ||
      error instanceof ForbiddenError
    ) {
      throw error;
    }
    // Handle any unexpected errors
    throw new UnauthorizedError("Authentication failed");
  }
};

function extractTokenFromHeader(c: Context): string {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("Authentication required");
  }
  const parts = authHeader.split(" ");
  if (parts.length < 2 || !parts[1]) {
    throw new UnauthorizedError("Invalid Authorization header format");
  }
  return parts[1];
}

async function verifyToken(token: string) {
  try {
    const payload = (await verify(token, JWT_SECRET as string)) as {
      user_id: string;
    };
    if (!payload || !payload.user_id) {
      throw new UnauthorizedError("Invalid token");
    }
    return payload;
  } catch (error) {
    throw new UnauthorizedError("Invalid token");
  }
}

async function validateUser(userId: string) {
  const user = await getUserByIdService(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return user;
}

function setupAuthContext(c: Context, payload: any) {
  c.set("jwtPayload", payload);
  c.set("user_id", payload.user_id);
}

export default authenticate;