import User from "@/models/user.model";
import { Context } from "hono";
import { NotFoundError, BadRequestError } from "@/utils/error";
import { compare, hash } from "bcrypt";

export const getUserProfile = async (c: Context) => {
  try {
    const user_id = c.get("user_id");
    const user = await User.findById(user_id);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const { password, ...userWithoutPassword } = user.toObject();

    return c.json(
      {
        success: true,
        data: {
          user: userWithoutPassword,
        },
      },
      200
    );
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
  }
};

export const updateUserProfile = async (c: Context) => {
  try {
    const user_id = c.get("user_id");
    const updateData = c.get("validatedUserUpdateData");

    const user = await User.findByIdAndUpdate(user_id, updateData, {
      new: true,
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const { password: _, ...userWithoutPassword } = user.toObject();
    return c.json(
      {
        success: true,
        message: "User profile updated successfully",
        data: {
          user: userWithoutPassword,
        },
      },
      201
    );
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
  }
};

export const updateUserPassword = async (c: Context) => {
  try {
    const user_id = c.get("user_id");
    const { old_password, new_password } = c.get("validatedPasswordData");
    const user = await User.findById(user_id);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const isTheOldPasswordValid = await compare(old_password, user.password);
    if (!isTheOldPasswordValid) {
      throw new NotFoundError("Old password is incorrect");
    }

    if (old_password === new_password) {
      throw new BadRequestError("New password cannot be the same as old password");
    }

    const hashedPassword = await hash(new_password, 10);
    user.password = hashedPassword;

    await user.save();

    return c.json(
      {
        success: true,
        message: "Password updated successfully",
      },
      200
    );
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof BadRequestError) {
      throw error;
    }
  }
};
