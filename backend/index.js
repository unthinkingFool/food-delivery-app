import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import AuthRouter from "./routes/auth.routes.js";
import UserRouter from "./routes/user.routes.js";
import transporter from "./config/mail.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", AuthRouter);
app.use("/api/user", UserRouter);

app.listen(3000, () => {
  connectDB();
  console.log("backend server is running at post 3000");

  transporter.verify((error, success) => {
    if (error) {
      console.error("Email configuration failed:", error);
    } else {
      console.log("Email server is ready");
    }
  });
});
