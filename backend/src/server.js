import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import connectDB from "./config/db.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { authMiddleware } from "./middlewares/auth.js";

dotenv.config();
const PORT = process.env.PORT;

const app = express();

// middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

// public
app.use("/api/auth", authRoute);

// private
app.use(authMiddleware);
app.use("/api/users", userRoute);

// middleware hứng lỗi(đủ 4 tham số)
app.use(errorHandler);

await connectDB();

// app.listen(PORT, () => {
//   console.log("Chạy server thành công trên cổng:", PORT);
// });

//chuẩn bị cho vercel
export default app;
