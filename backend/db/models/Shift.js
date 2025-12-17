import mongoose from "mongoose";

const shiftSchema = new mongoose.Schema({
  employeeName: {
    type: String,
    required: true
  },

  checkIn: {
    type: String,
    required: true
  },

  checkOut: {
    type: String,
    required: true
  },

  createdAt: {
    type: String,
    required: true
  }
});

export default mongoose.model("Shift", shiftSchema);
