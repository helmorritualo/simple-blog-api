import { Hono } from "hono";
import { getCommentsByBlogId, addComment, deleteComment } from "./comment.controller";
import commentValidator from "@/middlewares/comment-validator";
import authenticate from "@/middlewares/authentication";

const commentRouter = new Hono();

commentRouter.get("/blog-posts/:blog_id/comments", authenticate, getCommentsByBlogId);
commentRouter.post("/blog-posts/:blog_id/comments", authenticate, commentValidator, addComment);
commentRouter.delete("/blog-posts/:comment_id/comments", authenticate, deleteComment);

export default commentRouter;