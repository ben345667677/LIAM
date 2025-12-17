import express from "express";
import connectDB from "./db/db_connection.js";
import mainRouter from "./route/mainRouter.js";
connectDB();

const app = express();
app.use(express.json());
app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use("/api", mainRouter);
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});