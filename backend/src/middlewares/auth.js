import User from "../models/User.js";
import { verifyAccessToken } from "../utils/jwt.js";

export const authMiddleware = async (req, res, next) => {
  try {
    // Lấy header chứa accessToken
    const header = req.headers.authorization; // beaer <token>
    if (!header) {
      return res.status(401).json({ message: "Token không tồn tại!" });
    }

    // Lấy accessToken trong header
    const token = header.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Không tìm thấy access token!" });
    }

    // Kiểm tra so sánh accessToken với KEY accessToken
    const decoded = token && verifyAccessToken(token);

    //Lấy user từ DB thông qua payload của accessToken
    const user = await User.findById(decoded.userId).select("-hashPassword");
    if (!user) {
      return res.status(404).json({ message: "Tài khoản không tìm thấy" });
    }

    // Lưu user vào req và đến bước tiếp theo
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token không hợp lệ!" });
  }
};
