import BlogPost from "@/models/blog-post.model";
import { Context } from "hono";
import { NotFoundError, BadRequestError } from "@/utils/error";
import { deleteUploadedFile } from "@/middlewares/file-upload";

export const getAllBlogPosts = async (c: Context) => {
  try {
    const posts = await BlogPost.find()
      .populate("postedBy", "full_name profile_picture")
      .sort({ createdAt: -1 });
    return c.json(
      {
        success: true,
        data: posts,
      },
      200
    );
  } catch (error) {
    throw new BadRequestError("Failed to fetch blog posts");
  }
};

export const getBlogPostById = async (c: Context) => {
  try {
    const postId = c.req.param("id");
    const post = await BlogPost.findById(postId).populate(
      "postedBy",
      "full_name profile_picture"
    );
    if (!post) {
      throw new NotFoundError("Blog post not found");
    }

    return c.json(
      {
        success: true,
        data: post,
      },
      200
    );
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
  }
};

export const createBlogPost = async (c: Context) => {
  try {
    const user_id = c.get("user_id");
    const { title, content, thumbnail } = c.get("validatedBlogData");

    const newPost = new BlogPost({
      title,
      content,
      thumbnail,
      postedBy: user_id,
    });

    await newPost.save();

    return c.json(
      {
        success: true,
        message: "Blog post created successfully",
        data: newPost,
      },
      201
    );
  } catch (error) {
    if (error instanceof BadRequestError) {
      throw error;
    }
    throw new BadRequestError("Failed to create blog post");
  }
};

export const updateBlogPost = async (c: Context) => {
  try {
    const postId = c.req.param("id");
    const updateData = c.get("validatedUpdateBlogData");

    const existingPost = await BlogPost.findById(postId).populate(
      "postedBy",
      "full_name"
    );
    if (!existingPost) {
      throw new NotFoundError("Blog post not found");
    } // If updating thumbnail and old thumbnail exists, delete the old file
    if (
      updateData.thumbnail &&
      existingPost.thumbnail &&
      existingPost.thumbnail !== updateData.thumbnail
    ) {
      // Only delete if it's a local file (starts with /uploads/)
      if (existingPost.thumbnail.startsWith("/uploads/")) {
        deleteUploadedFile(existingPost.thumbnail, "thumbnails");
      }
    }

    const updatedPost = await BlogPost.findByIdAndUpdate(postId, updateData, {
      new: true,
    });

    return c.json(
      {
        success: true,
        message: "Blog post updated successfully",
        data: updatedPost,
      },
      201
    );
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof BadRequestError) {
      throw error;
    }
    throw new BadRequestError("Failed to update blog post");
  }
};

export const deleteBlogPost = async (c: Context) => {
  try {
    const postId = c.req.param("id");
    const postToDelete = await BlogPost.findById(postId);

    if (!postToDelete) {
      throw new NotFoundError("Blog post not found");
    } // Delete associated thumbnail file if it exists
    if (
      postToDelete.thumbnail &&
      postToDelete.thumbnail.startsWith("/uploads/")
    ) {
      deleteUploadedFile(postToDelete.thumbnail, "thumbnails");
    }

    await BlogPost.findByIdAndDelete(postId);

    return c.json(
      {
        success: true,
        message: "Blog post deleted successfully",
      },
      200
    );
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    throw new BadRequestError("Failed to delete blog post");
  }
};
