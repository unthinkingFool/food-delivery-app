import express from "express";

import {
  register,
  login,
  logout,
  forgotPassword,
  verifyOTP,
  resetPassword
} from "../controllers/auth.controller.js";

const AuthRouter = express.Router();

// ============================================================
// REGISTER
// ============================================================
// POST /api/auth/register/customer
// POST /api/auth/register/restaurant
// POST /api/auth/register/rider
AuthRouter.post("/register/:role", register);

// ============================================================
// LOGIN
// ============================================================
// POST /api/auth/login/customer
// POST /api/auth/login/restaurant
// POST /api/auth/login/rider
AuthRouter.post("/login/:role", login);

// ============================================================
// LOGOUT
// ============================================================
// POST /api/auth/logout
AuthRouter.post("/logout", logout);

//=============================================================
// Forget Password
//=============================================================
AuthRouter.post("/forgot-password/:role", forgotPassword);

// ============================================================
// verify otp
// ============================================================
AuthRouter.post("/verify-otp/:role", verifyOTP);

// ============================================================
// Reset Password
// =============================================================
AuthRouter.post("/reset-password/:role", resetPassword);


export default AuthRouter;
