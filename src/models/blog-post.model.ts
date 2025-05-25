import mongoose from "mongoose";

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    default: null,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true });

//Delete comments when blog post is deleted
blogPostSchema.pre(['findOneAndDelete', 'deleteOne'], async function() {
  const blogPostId = this.getQuery()._id;
  await mongoose.model('Comment').deleteMany({ blog_id: blogPostId });
});

const BlogPost = mongoose.model("BlogPost", blogPostSchema);

export default BlogPost;
