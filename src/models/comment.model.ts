import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    blog_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogPost",
      required: true,
      index: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },{ timestamps: true }
);

commentSchema.index({ blog_id: 1, createdAt: -1 });
commentSchema.index({ postedBy: 1, createdAt: -1 });

const Comment = mongoose.model("Comment", commentSchema);
Comment.createIndexes();

export default Comment;
