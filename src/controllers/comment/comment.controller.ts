import Comment from "@/models/comment.model";
import { Context } from "hono";
import { NotFoundError, BadRequestError } from "@/utils/error";

export const getCommentsByBlogId = async (c: Context) => {
  try {
    const blogId = c.req.param("blog_id");
    if (!blogId) {
      throw new BadRequestError("Blog ID is required");
    }

    const comments = await Comment.find({ blog_id: blogId }).populate(
      "postedBy",
      "full_name profile_picture"
    );

    return c.json(
      {
        success: true,
        data: comments,
      },
      200
    );
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof BadRequestError) {
      throw error;
    }
  }
};

export const addComment = async (c: Context) => {
  try {
    const validatedData = c.get("validatedCommentData");
    const user_id = c.get("user_id");

    const blogId = c.req.param("blog_id");
    if (!blogId) {
      throw new BadRequestError("Blog ID is required");
    }

    const comment = new Comment({
      ...validatedData,
      blog_id: blogId,
      postedBy: user_id,
    });

    const savedComment = await comment.save();
    return c.json(
      {
        success: true,
        message: "Comment added successfully",
        data: savedComment,
      },
      201
    );
  } catch (error) {
    if (error instanceof BadRequestError) {
      throw error;
    }
  }
};

export const deleteComment = async (c: Context) => {
  try {
    const commentId = c.req.param("comment_id");
    const user_id = c.get("user_id");

    if (!commentId) {
      throw new BadRequestError("Comment ID is required");
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new NotFoundError("Comment not found");
    }

    // Check if the user is the owner of the comment
    if (comment.postedBy.toString() !== user_id) {
      throw new BadRequestError("You can only delete your own comments");
    }

    await Comment.findByIdAndDelete(commentId);

    return c.json(
      {
        success: true,
        message: "Comment deleted successfully",
      },
      200
    );
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof BadRequestError) {
      throw error;
    }
  }
};
