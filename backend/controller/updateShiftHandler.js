import Shift from "../db/models/Shift.js";

const newShift = async (req, res) => {
  const { employeeName, checkIn, checkOut, createdAt } = req.body;

  try {
    // בדיקה שכל השדות קיימים
    if (!employeeName || !checkIn || !checkOut || !createdAt) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const shift = await Shift.create({
      employeeName,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      createdAt
    });

    res.status(201).json({
      message: "Shift created successfully",
      shift
    });

  } catch (err) {
    console.error("CREATE SHIFT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export default newShift;
