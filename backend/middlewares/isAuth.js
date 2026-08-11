import jwt from "jsonwebtoken";

export const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(400).json({
        message: "token not found while authenticating",
      });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decode) {
      return res.status(400).json({
        message: "token not verified while authenticating",
      });
    }
    console.log(decode);
    req.id = decode.id;
    next();
  } catch (error) {
    return res.status(400).json({
      message: `error while authenticating (isAuth error) : ${error}`,
    });
  }
};
