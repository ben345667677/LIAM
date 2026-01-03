import dotenv from "dotenv";
import express from "express";
import MainRouter from "./Route/Mainroute.js";
import connectDB from "./db/DbConaction.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

await connectDB(); // חשוב!

app.use("/api", MainRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});