import User from "../db/model/userModel.js"
const sginin  = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const emaildb = await User.findOne({ email });
  const usernamedb = await User.findOne({ username });
  if (user) {
    return res.status(404).json({
      message: " User olredy exists",
    });
  }
  if (emaildb) {
    return res.status(404).json({
      message: " email olredy exists",
    });
  }
  await User.create()
  return res.status(200).json({
    message: "User exists",
    user,
  });
};
export default sginin