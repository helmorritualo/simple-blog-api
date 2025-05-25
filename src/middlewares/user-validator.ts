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
      })
      .optional(),

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
    let body: any = {};
    const contentType = c.req.header("content-type");

    if (contentType && contentType.includes("multipart/form-data")) {
      const formData = await c.req.formData();

      const fullName = formData.get("full_name")?.toString();
      const email = formData.get("email")?.toString();
      const username = formData.get("username")?.toString();
      const gender = formData.get("gender")?.toString();
      const profilePicture = c.get("uploadedProfilePicture");

      if (fullName) body.full_name = fullName;
      if (email) body.email = email;
      if (username) body.username = username;
      if (gender) body.gender = gender;
      if (profilePicture) body.profile_picture = profilePicture;
    } else {
      body = await c.req.json();
      // If profile picture was uploaded, use the uploaded file URL
      if (c.get("uploadedProfilePicture")) {
        body.profile_picture = c.get("uploadedProfilePicture");
      }
    }

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
