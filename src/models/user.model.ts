import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    profile_picture: {
      type: String,
      default: function (this: any) {
        return this.gender === "female"
          ? "https://avatar.iran.liara.run/public/girl"
          : "https://avatar.iran.liara.run/public/boy";
      },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
