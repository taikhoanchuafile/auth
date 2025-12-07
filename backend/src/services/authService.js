import User from "../models/User.js";
import Token from "../models/Token.js";
import { signAccessToken } from "../utils/jwt.js";
import { cryptoRandomString, hashedCryptoString } from "../utils/crypto.js";

export const registerService = async (data) => {
  // Kiểm tra dữ liệu có đầy đủ hay không!
  const { name, email, password } = data;
  if (!name || !email || !password) {
    throw new Error("Thiếu dữ liệu!");
  }

  // Kiểm tra xem có trùng email không!
  const duplicate = await User.findOne({ email });
  if (duplicate) {
    throw new Error("Email đã tồn tại");
  }
  // Lưu user vào db( tự động mã hóa password với hàm schema.pre("save") trong model)
  const user = await User.create({ name, email, hashPassword: password });

  //trả về user
  return user;
};

export const loginService = async (email, password) => {
  const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60 * 1000;
  // Kiểm tra dữ liệu có đủ không
  if (!email || !password) {
    throw new Error("Thiếu dữ liệu!");
  }

  //Kiểm tra email có tồn tại không
  const user = await User.findOne({ email }).select("+hashPassword");
  if (!user) {
    throw new Error("Tài khoản không tồn tại!");
  }

  // kiểm tra so sánh password FE với password DB: dùng hàm đã thiết lập trong model để compare
  const match = await user.comparePassword(password);
  if (!match) {
    throw new Error("Tài khoản hoặc mật khẩu không chính xác!");
  }

  // Tạo accessToken
  const accessToken = signAccessToken(user._id.toString());

  // Tạo refreshToken
  const refreshToken = cryptoRandomString;
  const hashedRefreshToken = hashedCryptoString(refreshToken);
  console.log(hashedRefreshToken);

  // Lưu hashedRefreshToken vào db
  await Token.create({
    userId: user._id,
    token: hashedRefreshToken,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
  });

  // trả về 2 loại accessToken, refreshToken;
  return { accessToken, refreshToken };
};

export const logoutService = async (refreshToken) => {
  const hashedRefreshToken = hashedCryptoString(refreshToken);
  return await Token.deleteOne({ token: hashedRefreshToken });
};

export const refreshTokenService = async (refreshToken) => {};
