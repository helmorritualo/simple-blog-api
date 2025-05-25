import { Context, Next } from "hono";
import { BadRequestError } from "@/utils/error";
import { z } from "zod/v4";

const commentSchema = z.object({
  comment: z.string().min(1, "Content cannot be empty").optional(),
});

const commentValidator = async (c: Context, next: Next) => {
  try {
    const body = await c.req.json();
    const validatedData = commentSchema.parse(body);
    c.set("validatedCommentData", validatedData);

    await next();
  } catch (zodError) {
    if (zodError instanceof z.ZodError) {
      const errorMessage = zodError.issues
        .map((issue) => `${issue.message}`)
        .join(", ");
      throw new BadRequestError(errorMessage);
    }
    throw new BadRequestError("Invalid request data");
  }
};

export default commentValidator;
