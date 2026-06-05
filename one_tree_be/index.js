import "dotenv/config";
import express from "express";
import cors from "cors";
import routes from "./src/routes/index.js";

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

app.use("/api", routes);

app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
