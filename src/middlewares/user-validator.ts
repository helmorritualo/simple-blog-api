import { Context, Next } from "hono";
import { BadRequestError } from "@/utils/error";
import { z } from "zod/v4";

// User update schema
export const userUpdateSchema = z
  .object({
    full_name: z.string().min(1).optional(),

    email: z
      .email({
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Invalid email format",
      })
      .optional(),

    username: z
      .string()
      .min(4, {
        message: "Username must be at least 4 characters long",
      }).optional(),

    gender: z
      .string()
      .refine((value) => ["male", "female"].includes(value), {
        message: "Gender must be male and female",
      })
      .optional(),

    profile_picture: z.string().optional(),
  })

  // Ensure at least one field is provided
  .refine(
    (data) => {
      return Object.values(data).some((value) => value !== undefined);
    },
    {
      message: "At least one field is required to update",
    }
  );

// Password update schema
export const passwordUpdateSchema = z.object({
  old_password: z.string({
    message: "Old password is required",
  }),

  new_password: z
    .string({
      message: "New password is required",
    })
    .min(6, {
      message: "New password must be at least 6 characters long",
    }),
});

export const validateUserUpdate = async (c: Context, next: Next) => {
  try {
    const body = await c.req.json();
    const validatedData = userUpdateSchema.parse(body);

    c.set("validatedUserUpdateData", validatedData);

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

export const validateUpdatePassword = async (c: Context, next: Next) => {
  try {
    const body = await c.req.json();
    const validatedData = passwordUpdateSchema.parse(body);

    c.set("validatedPasswordData", validatedData);

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
