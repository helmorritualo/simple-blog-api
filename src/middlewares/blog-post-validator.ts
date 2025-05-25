import { Context, Next } from "hono";
import { BadRequestError } from "@/utils/error";
import { z } from "zod/v4";

const blogPostSchema = z.object({
  title: z
    .string({
      message: "Title is required",
    })
    .min(6, {
      message: "Title must be at least 6 characters long",
    }),
  content: z
    .string({
      message: "Content is required",
    })
    .min(10, {
      message: "Content must be at least 10 characters long",
    }),

  thumbnail: z.string().optional(),
});

const blogPostUpdateSchema = blogPostSchema.partial().refine(
  // Ensure at least one field is provided
  (data) => {
    return Object.values(data).some((value) => value !== undefined);
  },
  {
    message: "At least one field is required to update",
  }
);

export const blogPostValidator = async (c: Context, next: Next) => {
  try {
    let body: any = {};
    const contentType = c.req.header("content-type");

    if (contentType && contentType.includes("multipart/form-data")) {
      const formData = await c.req.formData();
      body = {
        title: formData.get("title")?.toString(),
        content: formData.get("content")?.toString(),
        thumbnail: c.get("uploadedThumbnail") || undefined,
      };
    } else {
      body = await c.req.json();
      if (c.get("uploadedThumbnail")) {
        body.thumbnail = c.get("uploadedThumbnail");
      }
    }

    const validatedData = blogPostSchema.parse(body);
    c.set("validatedBlogData", validatedData);

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

export const blogPostUpdateValidator = async (c: Context, next: Next) => {
  try {
    let body: any = {};
    const contentType = c.req.header("content-type");

    if (contentType && contentType.includes("multipart/form-data")) {
      const formData = await c.req.formData();

      const title = formData.get("title")?.toString();
      const content = formData.get("content")?.toString();
      const thumbnail = c.get("uploadedThumbnail");

      if (title) body.title = title;
      if (content) body.content = content;
      if (thumbnail) body.thumbnail = thumbnail;
    } else {
      body = await c.req.json();
      // If thumbnail was uploaded, use the uploaded file URL
      if (c.get("uploadedThumbnail")) {
        body.thumbnail = c.get("uploadedThumbnail");
      }
    }

    const validatedData = blogPostUpdateSchema.parse(body);
    c.set("validatedUpdateBlogData", validatedData);

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
