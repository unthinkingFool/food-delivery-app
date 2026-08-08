import jwt from "jsonwebtoken";
import { getCurrentUser } from "../controllers/user.controller.js";

const isAuth = async (req, res, next) => {
  try {
    // ==========================
    // 1. Get token from cookie
    // ==========================

    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // ==========================
    // 2. Verify JWT
    // ==========================

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ==========================
    // 3. Get user id + role
    // ==========================

    const { id, role } = decoded;

    if (!id || !role) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
    }

    // ==========================
    // 4. Fetch current user
    // ==========================

    const user = await getCurrentUser(id, role);

    // ==========================
    // 5. Check user exists
    // ==========================

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists",
      });
    }

    // ==========================
    // 6. Attach user to request
    // ==========================

    req.user = user;

    // Keep role available as well
    req.user.role = role;

    // ==========================
    // 7. Continue
    // ==========================

    next();
  } catch (error) {
    console.error("Authentication error:", error);

    // Invalid JWT
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

export default isAuth;
