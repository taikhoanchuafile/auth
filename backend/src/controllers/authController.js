import Token from "../models/Token.js";
import {
  loginService,
  logoutService,
  registerService,
} from "../services/authService.js";
import { hashedCryptoString } from "../utils/crypto.js";
import { signAccessToken } from "../utils/jwt.js";

export const registerController = async (req, res, next) => {
  try {
    await registerService(req.body);
    res.sendStatus(204);
  } catch (error) {
    console.log("Lỗi khi gọi registerController", error);
    next(error);
  }
};
export const loginController = async (req, res, next) => {
  try {
    //
    const { email, password } = req.body;
    const { accessToken, refreshToken } = await loginService(email, password);

    // res refreshToken thông qua cookie về client
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, //chỉ cho BE đọc, không cho FE đọc
      secure: process.env.NODE_ENV === "production", //chỉ cho truy cập qua HTTPS nếu true
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", //FE và BE khác domain , nếu cùng thì "strict/lax"
      maxAge: 7 * 24 * 60 * 60 * 1000, // hạn sống của cookie
      path: "/", // gửi trên mọi request nếu không nó sẽ mặc định: /auth vì đường dẫn sinh ra cookies: /auth/login
    });
    res.status(200).json({ message: "Đăng nhập thành công", accessToken });
  } catch (error) {
    console.log("Lỗi khi gọi loginController", error);
    next(error);
  }
};

export const logoutController = async (req, res, next) => {
  try {
    // Lấy refreshToken từ cookie và kiểm tra
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      // xóa token trên DB
      await logoutService(refreshToken);

      // xóa token ở cookie
      res.clearCookie("refreshToken", {
        httpOnly: true, //chỉ cho BE đọc, không cho FE đọc
        secure: process.env.NODE_ENV === "production", //chỉ cho truy cập qua HTTPS nếu true
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", //FE và BE khác domain , nếu cùng thì "strict/lax"
        // maxAge: 7 * 24 * 60 * 60 * 1000, // hạn sống của cookie => bỏ khi clearCookie
        path: "/", // gửi trên mọi request nếu không nó sẽ mặc định: /auth vì đường dẫn sinh ra cookies: /auth/login
      });
    }
    res.sendStatus(204);
  } catch (error) {
    console.log("Lỗi khi gọi logoutController", error);
    next(error);
  }
};
export const refreshTokenController = async (req, res, next) => {
  try {
    // Lấy refreshToken từ cookie và kiểm tra
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Token không tồn tại!" });
    }

    //Kiểm tra refreshToken trên db
    const hashedRefreshToken = hashedCryptoString(refreshToken);
    const session = await Token.findOne({ token: hashedRefreshToken });
    if (!session) {
      return res
        .status(401)
        .json({ message: "Token đã hết hạn hoặc không đúng!" });
    }
    // TH refreshToken trên db đã hết hạn nhưng xóa tự động không làm ăn được, xét thời gian hết hạn
    if (session.expiresAt < new Date()) {
      return res.status(401).json({ message: "Token đã hết hạn!" });
    }

    // Tạo accessToken mới
    const newAccessToken = signAccessToken(session.userId.toString());

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.log("Lỗi khi gọi refreshTokenController", error);
    next(error);
  }
};
