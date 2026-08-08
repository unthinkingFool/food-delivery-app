`controllers/auth.controller.js`;

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import { generateOTP } from "../utils/otp.js";
import transporter from "../config/mail.js";

// ============================================================
// JWT CONFIG
// ============================================================

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

// ============================================================
// ROLE CONFIG
// ============================================================

const allowedRoles = ["customer", "restaurant", "rider"];

const roleConfig = {
  customer: {
    table: "customer",
  },

  restaurant: {
    table: "restaurant",
  },

  rider: {
    table: "rider",
  },
};

// ============================================================
// GENERATE JWT
// ============================================================

const generateToken = (user, role) => {
  try {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: role,
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );
  } catch (error) {
    console.log("error while generating token : ", error);
  }
};

// ============================================================
// COOKIE OPTIONS
// ============================================================

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// ============================================================
// REGISTER
// POST /api/auth/register/:role
// ============================================================

export const register = async (req, res) => {
  try {
    const { role } = req.params;

    // --------------------------------------------------------
    // Validate role
    // --------------------------------------------------------

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role.",
      });
    }

    const { name, email, password, phone_number, contact_no, address } =
      req.body;

    // --------------------------------------------------------
    // Validate common fields
    // --------------------------------------------------------

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    if (phone_number.length < 11) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be 11 digits.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const table = roleConfig[role].table;

    // --------------------------------------------------------
    // Check existing account
    // --------------------------------------------------------

    const existingUser = await pool.query(
      `SELECT id
             FROM ${table}
             WHERE email = $1`,
      [normalizedEmail],
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    // --------------------------------------------------------
    // Hash password
    // --------------------------------------------------------

    const hashedPassword = await bcrypt.hash(password, 12);

    let result;

    // ========================================================
    // CUSTOMER
    // ========================================================

    if (role === "customer") {
      if (!phone_number) {
        return res.status(400).json({
          success: false,
          message: "Phone number is required.",
        });
      }

      result = await pool.query(
        `INSERT INTO customer
                    (name, email, hashed_password, phone_number)
                 VALUES ($1, $2, $3, $4)
                 RETURNING id, name, email, phone_number`,
        [name.trim(), normalizedEmail, hashedPassword, phone_number],
      );
    }

    // ========================================================
    // RIDER
    // ========================================================

    if (role === "rider") {
      result = await pool.query(
        `INSERT INTO rider
                    (name, email, hashed_password, contact_no)
                 VALUES ($1, $2, $3, $4)
                 RETURNING id, name, email, contact_no, isapproved`,
        [name.trim(), normalizedEmail, hashedPassword, contact_no || null],
      );
    }

    // ========================================================
    // RESTAURANT
    // ========================================================

    if (role === "restaurant") {
      if (!address) {
        return res.status(400).json({
          success: false,
          message: "Address is required.",
        });
      }

      result = await pool.query(
        `INSERT INTO restaurant
                    (
                        name,
                        address,
                        email,
                        hashed_password,
                        contact_no
                    )
                 VALUES ($1, $2, $3, $4, $5)
                 RETURNING
                    id,
                    name,
                    address,
                    email,
                    contact_no,
                    isapproved,
                    status`,
        [
          name.trim(),
          address,
          normalizedEmail,
          hashedPassword,
          contact_no || null,
        ],
      );
    }

    const user = result.rows[0];

    // --------------------------------------------------------
    // Generate JWT
    // --------------------------------------------------------

    const token = generateToken(user, role);

    // --------------------------------------------------------
    // Store JWT in HttpOnly cookie
    // --------------------------------------------------------

    res.cookie("token", token, cookieOptions);

    // --------------------------------------------------------
    // Response
    // --------------------------------------------------------

    return res.status(201).json({
      success: true,
      message: "Registration successful.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error while registering.",
    });
  }
};

// ============================================================
// LOGIN
// POST /api/auth/login/:role
// ============================================================

export const login = async (req, res) => {
  try {
    const { role } = req.params;

    const { email, password } = req.body;

    // --------------------------------------------------------
    // Validate role
    // --------------------------------------------------------

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role.",
      });
    }

    // --------------------------------------------------------
    // Validate input
    // --------------------------------------------------------

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const table = roleConfig[role].table;

    // --------------------------------------------------------
    // Find user
    // --------------------------------------------------------

    const result = await pool.query(
      `SELECT *
             FROM ${table}
             WHERE email = $1`,
      [normalizedEmail],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const user = result.rows[0];

    // --------------------------------------------------------
    // Compare password
    // --------------------------------------------------------

    const passwordMatch = await bcrypt.compare(password, user.hashed_password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password.",
      });
    }

    // --------------------------------------------------------
    // Generate JWT
    // --------------------------------------------------------

    const token = generateToken(user, role);

    // --------------------------------------------------------
    // Store token in HttpOnly cookie
    // --------------------------------------------------------

    res.cookie("token", token, cookieOptions);

    // --------------------------------------------------------
    // Response
    // --------------------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error while logging in.",
    });
  }
};

// ============================================================
// LOGOUT
// POST /api/auth/logout
// ============================================================

export const logout = async (req, res) => {
  try {
    // --------------------------------------------------------
    // Clear JWT cookie
    // --------------------------------------------------------

    res.clearCookie("token");

    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.error("LOGOUT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error while logging out.",
    });
  }
};

// ============================================================
// Forget Password
// ============================================================

export const forgotPassword = async (req, res) => {
  try {
    const { role } = req.params;
    const { email } = req.body;

    // ==========================
    // 1. Validate role
    // ==========================

    const allowedRoles = ["customer", "restaurant", "rider"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    // ==========================
    // 2. Validate email
    // ==========================

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // ==========================
    // 3. Determine table
    // ==========================

    let table;

    if (role === "customer") {
      table = "CUSTOMER";
    } else if (role === "restaurant") {
      table = "RESTAURANT";
    } else if (role === "rider") {
      table = "RIDER";
    }

    // ==========================
    // 4. Find user
    // ==========================

    const result = await pool.query(
      `SELECT email FROM ${table} WHERE email = $1`,
      [email],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email",
      });
    }

    // ==========================
    // 5. Generate OTP
    // ==========================

    const otp = generateOTP();

    console.log("Generated OTP:", otp);

    // ==========================
    // 6. Hash OTP
    // ==========================

    const otpHash = await bcrypt.hash(otp, 10);

    // ==========================
    // 7. OTP expiration
    // ==========================

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // ==========================
    // 8. Remove old OTP
    // ==========================

    await pool.query(
      `
            DELETE FROM PASSWORD_RESET
            WHERE email = $1
            AND role = $2
            `,
      [email, role],
    );

    // ==========================
    // 9. Store new OTP
    // ==========================

    await pool.query(
      `
            INSERT INTO PASSWORD_RESET
            (
                email,
                role,
                otp_hash,
                expires_at
            )
            VALUES ($1, $2, $3, $4)
            `,
      [email, role, otpHash, expiresAt],
    );

    // ==========================
    // 10. Send OTP email
    // ==========================

    await transporter.sendMail({
      from: process.env.EMAIL_USER,

      to: email,

      subject: "KhaiDai Password Reset OTP",

      text: `
Your KhaiDai password reset OTP is:

${otp}

This OTP will expire in 10 minutes.

If you did not request a password reset,
please ignore this email.
            `,
    });

    // ==========================
    // 11. Response
    // ==========================

    return res.status(200).json({
      success: true,

      message: "OTP has been sent to your email",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(500).json({
      success: false,

      message: "Something went wrong",
    });
  }
};

// ============================================================
// verify otp
// ============================================================

export const verifyOTP = async (req, res) => {
  try {
    const { role } = req.params;
    const { email, otp } = req.body;

    // ==========================
    // 1. Validate role
    // ==========================

    const allowedRoles = ["customer", "restaurant", "rider"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    // ==========================
    // 2. Validate input
    // ==========================

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    // ==========================
    // 3. Find OTP
    // ==========================

    const result = await pool.query(
      `
            SELECT *
            FROM PASSWORD_RESET
            WHERE email = $1
            AND role = $2
            ORDER BY created_at DESC
            LIMIT 1
            `,
      [email, role],
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "OTP not found or expired",
      });
    }

    const resetRequest = result.rows[0];

    // ==========================
    // 4. Check expiration
    // ==========================

    if (new Date(resetRequest.expires_at) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    // ==========================
    // 5. Check if already verified
    // ==========================

    if (resetRequest.verified) {
      return res.status(400).json({
        success: false,
        message: "OTP has already been used",
      });
    }

    // ==========================
    // 6. Compare OTP
    // ==========================

    const isValidOTP = await bcrypt.compare(otp, resetRequest.otp_hash);

    if (!isValidOTP) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // ==========================
    // 7. Mark OTP verified
    // ==========================

    await pool.query(
      `
            UPDATE PASSWORD_RESET
            SET verified = TRUE
            WHERE id = $1
            `,
      [resetRequest.id],
    );

    // ==========================
    // 8. Success
    // ==========================

    return res.status(200).json({
      success: true,

      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("Verify OTP error:", error);

    return res.status(500).json({
      success: false,

      message: "Something went wrong",
    });
  }
};

// ============================================================
// Reset Password
// ============================================================
export const resetPassword = async (req, res) => {

    try {

        const { role } = req.params;
        const { email, newPassword } = req.body;

        // ==========================
        // 1. Validate role
        // ==========================

        const allowedRoles = [
            "customer",
            "restaurant",
            "rider"
        ];

        if (!allowedRoles.includes(role)) {

            return res.status(400).json({
                success: false,
                message: "Invalid role"
            });

        }

        // ==========================
        // 2. Validate input
        // ==========================

        if (!email || !newPassword) {

            return res.status(400).json({
                success: false,
                message: "Email and new password are required"
            });

        }

        // ==========================
        // 3. Password validation
        // ==========================

        if (newPassword.length < 6) {

            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });

        }

        // ==========================
        // 4. Check verified OTP
        // ==========================

        const resetResult = await pool.query(
            `
            SELECT *
            FROM PASSWORD_RESET
            WHERE email = $1
            AND role = $2
            AND verified = TRUE
            ORDER BY created_at DESC
            LIMIT 1
            `,
            [email, role]
        );

        if (resetResult.rows.length === 0) {

            return res.status(400).json({
                success: false,
                message: "OTP verification required"
            });

        }

        const resetRequest = resetResult.rows[0];

        // ==========================
        // 5. Check OTP expiration
        // ==========================

        if (
            new Date(resetRequest.expires_at) < new Date()
        ) {

            return res.status(400).json({
                success: false,
                message: "OTP has expired"
            });

        }

        // ==========================
        // 6. Hash new password
        // ==========================

        const hashedPassword = await bcrypt.hash(
            newPassword,
            12
        );

        // ==========================
        // 7. Determine table
        // ==========================

        let table;

        if (role === "customer") {
            table = "CUSTOMER";
        }

        else if (role === "restaurant") {
            table = "RESTAURANT";
        }

        else if (role === "rider") {
            table = "RIDER";
        }

        // ==========================
        // 8. Update password
        // ==========================

        const updateResult = await pool.query(
            `
            UPDATE ${table}
            SET hashed_password = $1
            WHERE email = $2
            `,
            [
                hashedPassword,
                email
            ]
        );

        if (updateResult.rowCount === 0) {

            return res.status(404).json({
                success: false,
                message: "User account not found"
            });

        }

        // ==========================
        // 9. Delete used reset request
        // ==========================

        await pool.query(
            `
            DELETE FROM PASSWORD_RESET
            WHERE id = $1
            `,
            [resetRequest.id]
        );

        // ==========================
        // 10. Success
        // ==========================

        return res.status(200).json({

            success: true,

            message:
                "Password reset successfully"

        });

    } catch (error) {

        console.error(
            "Reset password error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Something went wrong"

        });

    }

};