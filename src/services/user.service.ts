import User from "@/models/user.model";

const getUserById = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error(`Error fetching user: ${error}`);
  }
};

export default getUserById


