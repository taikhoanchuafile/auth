export const authMe = (req, res, next) => {
  try {
    const user = req.user;
    res.status(200).json({ user });
  } catch (error) {
    console.log("Lỗi khi gọi authMe", error);
    next(error);
  }
};

export const test = (req, res) => {
  return res.sendStatus(204);
};
