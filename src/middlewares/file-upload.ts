import { Context, Next } from "hono";
import { BadRequestError } from "@/utils/error";
import fs from "fs";
import path from "path";

// Ensure uploads directory exists
const ensureUploadDirExists = () => {
  const uploadsDir = path.join(process.cwd(), "uploads", "thumbnails");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
};

ensureUploadDirExists();

const getFileUrl = (fileName: string): string => {
  return `/uploads/thumbnails/${fileName}`;
};

// Middleware to handle file upload
export const handleThumbnailUpload = async (c: Context, next: Next) => {
  try {
    const contentType = c.req.header("content-type");

    if (contentType && contentType.includes("multipart/form-data")) {
      const formData = await c.req.formData();
      const thumbnailFile = formData.get("thumbnail") as File;

      if (thumbnailFile && thumbnailFile.size > 0) {
        if (!thumbnailFile.type.startsWith("image/")) {
          throw new BadRequestError("Only image files are allowed!");
        }

        if (thumbnailFile.size > 5 * 1024 * 1024) {
          throw new BadRequestError("File too large. Maximum size is 5MB.");
        }

        // Generate unique filename
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const fileExtension = path.extname(thumbnailFile.name);
        const fileName = `thumbnail-${uniqueSuffix}${fileExtension}`;

        // Save file to disk
        const uploadsDir = path.join(process.cwd(), "uploads", "thumbnails");
        const filePath = path.join(uploadsDir, fileName);

        // Convert File to Buffer and save
        const arrayBuffer = await thumbnailFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        fs.writeFileSync(filePath, buffer);

        const fileUrl = getFileUrl(fileName);
        c.set("uploadedThumbnail", fileUrl);
      }
    }
    await next();
  } catch (error) {
    console.error("File upload error:", error);
    if (error instanceof BadRequestError) {
      throw error;
    }
  }
};

export const deleteUploadedFile = (filePath: string) => {
  try {
    const fullPath = path.join(
      process.cwd(),
      "uploads",
      "thumbnails",
      path.basename(filePath)
    );
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (error) {
    console.error("Error deleting file:", error);
  }
};
