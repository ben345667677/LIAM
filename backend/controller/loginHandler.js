// controllers/loginHandler.js
import User from "../db/models/User.js";
import { createTokens } from "./TokenHandler.js";

const loginHandler = async (req, res) => {
  console.log(req.headers["content-type"]);
  console.log(req.body);

  if (!req.body.email || !req.body.password) { return res.status(500).send("no credentials found") }
  const { email, password } = req.body;

  try {
    // 1️⃣ מציאת משתמש
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ⚠️ לפרויקט לימוד בלבד
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 2️⃣ יצירת טוקנים דרך handler חיצוני
    const { accessToken, refreshToken } = createTokens(user);

    // 3️⃣ שמירת refresh ב־DB
    user.refreshToken = refreshToken;
    await user.save();

    // 4️⃣ שליחת refresh כ-cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    // 5️⃣ החזרת access בלבד
    return res.status(200).json({
      message: "Login successful",
      accessToken,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export default loginHandler;
