import { Hono } from "hono";
import {
  getAllBlogPosts,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from "./blog-post.controller";
import authenticate from "@/middlewares/authentication";
import {
  blogPostUpdateValidator,
  blogPostValidator,
} from "@/middlewares/blog-post-validator";
import { handleThumbnailUpload } from "@/middlewares/file-upload";

const blogPostRouter = new Hono();

blogPostRouter.get("/blog-posts", authenticate, getAllBlogPosts);
blogPostRouter.get("/blog-posts/:id", authenticate, getBlogPostById);

blogPostRouter.post(
  "/blog-posts",
  authenticate,
  handleThumbnailUpload,
  blogPostValidator,
  createBlogPost
);
blogPostRouter.put(
  "/blog-posts/:id",
  authenticate,
  handleThumbnailUpload,
  blogPostUpdateValidator,
  updateBlogPost
);
blogPostRouter.delete("/blog-posts/:id", authenticate, deleteBlogPost);

export default blogPostRouter;
