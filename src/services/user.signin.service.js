import bcrypt from "bcryptjs";
import { findUserByEmail } from "../repositories/user.repository.js";
import { generateToken } from "../utils/jwt.util.js";

export const loginUser = async ({ email, password }) => {

  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("Invalid email or password");
  }


  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  
  const token = generateToken({
    userId: user._id,
    email: user.email
  });

  return { user, token };
};
