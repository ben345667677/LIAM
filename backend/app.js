import express from "express";
import cors from "cors";

import connectDB from "./db/db_connection.js";
import mainRouter from "./route/mainRouter.js";

connectDB();

const app = express();

/* middleware */
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

/* routes */
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api", mainRouter);

/* server */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
