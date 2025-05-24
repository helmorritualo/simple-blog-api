import User from "@/models/user.model";
import { Context } from "hono";
import { BadRequestError, NotFoundError } from "@/utils/error";
import { sign } from "hono/jwt";
import { compare, hash } from "bcrypt";
import { JWT_SECRET } from "@/config/env";

export const register = async (c: Context) => {
  try {
    const { full_name, email, username, password, gender } = c.get(
      "validatedRegisterData"
    );

    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      throw new BadRequestError("User already exists");
    }

    const hashedPassword = await hash(password, 10);
    const newUser = new User({
      full_name,
      email,
      username,
      password: hashedPassword,
      gender,
    });

    await newUser.save();

    const { password: _, ...userWithoutPassword } = newUser.toObject();

    return c.json(
      {
        success: true,
        message: "User registered successfully",
        data: {
          user: userWithoutPassword,
        },
      },
      201
    );
  } catch (error) {
    if (error instanceof BadRequestError) {
      throw error;
    }
  }
};

export const login = async (c: Context) => {
  try {
    const { username, password } = c.get("validatedLoginData");

    const user = await User.findOne({ username });
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const isPasswordMatch = await compare(password, user.password);
    if (!isPasswordMatch) {
      throw new BadRequestError("Invalid password");
    }

    const token = await sign(
      {
        user_id: user._id,
        email: user.email,
        exp: Math.floor(Date.now() / 1000) + 12 * 60 * 60, // token expire in 12 hours
      },
      JWT_SECRET as string
    );

    const { password: _, ...userWithoutPassword } = user.toObject();

    return c.json(
      {
        success: true,
        message: "User logged in successfully",
        data: {
          user: userWithoutPassword,
          token,
        },
      },
      200
    );
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof BadRequestError) {
      throw error;
    }
  }
};
