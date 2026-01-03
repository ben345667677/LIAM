import jwt from "jsonwebtoken";
import User from "../db/model/userModel.js";

const login =async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Invalid credentials",
    });
  }

  const user = await User.findOne({ username });

  if (!user) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  if (user.password !== password) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  // ✅ יצירת JWT
  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );

  return res.status(200).json({
    message: "Login successful",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      token,
    },
  });
};

export  default login