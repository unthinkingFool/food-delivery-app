import pool from "../config/db.js";

export const getCurrentUser = async (id, role) => {
  let table;

  // ==========================
  // Determine user table
  // ==========================

  if (role === "customer") {
    table = "CUSTOMER";
  } else if (role === "restaurant") {
    table = "RESTAURANT";
  } else if (role === "rider") {
    table = "RIDER";
  } else {
    throw new Error("Invalid user role");
  }

  // ==========================
  // Fetch user
  // ==========================

  const result = await pool.query(
    `
        SELECT *
        FROM ${table}
        WHERE id = $1
        `,
    [id],
  );

  // ==========================
  // User not found
  // ==========================

  if (result.rows.length === 0) {
    return null;
  }

  // ==========================
  // Return user
  // ==========================

  return result.rows[0];
};
