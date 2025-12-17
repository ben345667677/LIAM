import User from "../db/models/User.js";
const registerHandler = async (req, res) => {
  console.log("Register handler called");
  console.log(req.body);
  const { email, password } = req.body;

  try {
    // בדיקה אם המשתמש כבר קיים
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // יצירת יוזר חדש
    const user = await User.create({
      email,
      password
    });

    res.status(201).json({
      message: "User created successfully",
      user
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export default registerHandler;
