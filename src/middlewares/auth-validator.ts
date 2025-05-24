import { Context, Next } from "hono";
import { BadRequestError } from "@/utils/error";
import { z } from "zod/v4";

// zod Register schema
export const registerSchema = z.object({
  full_name: z
    .string({
      message: "Full name is required",
    })
    .min(1),

  email: z.email({
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Invalid email format",
  }),
  username: z
    .string({
      message: "Username is required",
    })
    .min(4, {
      message: "Username must be at least 4 character long",
    }),

  password: z
    .string({
      message: "Password is required",
    })
    .min(6, {
      message: "Password must be at least 6 characters  long",
    }),

  gender: z.string().refine((value) => ["male", "female"].includes(value), {
    message: "Gender must be male and female",
  }),
});

// zod Login schema
export const loginSchema = z.object({
  username: z.string({
    message: "Username is required",
  }),
  password: z.string({
    message: "Password is required",
  }),
});

export const validateRegister = async (c: Context, next: Next) => {
  try {
    const body = await c.req.json();
    const validatedData = registerSchema.parse(body);

    c.set("validatedRegisterData", validatedData);

    await next();
  } catch (zodError) {
    if (zodError instanceof z.ZodError) {
      const errorMessages = zodError.issues
        .map((issue) => `${issue.message}`)
        .join(", ");
      throw new BadRequestError(errorMessages);
    }
    throw new BadRequestError("Invalid request data");
  }
};

export const validateLogin = async (c: Context, next: Next) => {
  try {
    const body = await c.req.json();
    const validatedData = loginSchema.parse(body);

    c.set("validatedLoginData", validatedData);

    await next();
  } catch (zodError) {
    if (zodError instanceof z.ZodError) {
      const errorMessages = zodError.issues
        .map((issue) => `${issue.message}`)
        .join(", ");
      throw new BadRequestError(errorMessages);
    }
    throw new BadRequestError("Invalid request data");
  }
};
