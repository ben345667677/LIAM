import jwt from "jsonwebtoken";

const tokenVerify = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // שומר את המשתמש בבקשה
    req.userId = decoded.userId;

    next(); // ממשיכים ל־route הבא
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default tokenVerify;
