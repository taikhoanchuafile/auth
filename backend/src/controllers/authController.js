import {
  loginService,
  logoutService,
  refreshTokenService,
  registerService,
} from "../services/authService.js";

export const registerController = async (req, res, next) => {
  try {
    const user = await registerService(req.body);
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
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", //FE và BE khác domain , nếu cùng thì "strict/lax"
      maxAge: 7 * 24 * 60 * 60 * 1000, // hạn sống của cookie
      path: "/",
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
      res.clearCookie("refreshToken");
    }
    res.sendStatus(204);
  } catch (error) {
    console.log("Lỗi khi gọi logoutController", error);
    next(error);
  }
};
export const refreshTokenController = async (req, res, next) => {
  try {
    console.log("cookies:", req.cookies);
    // Lấy refreshToken từ cookie và kiểm tra
    const refreshToken = req.cookies?.refreshToken;
    console.log(refreshToken);

    if (!refreshToken) {
      return res.status(401).json("Token không tồn tại!");
    }

    // Tạo accessToken mới
    const newAccessToken = await refreshTokenService(refreshToken);

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.log("Lỗi khi gọi refreshTokenController", error);
    next(error);
  }
};
