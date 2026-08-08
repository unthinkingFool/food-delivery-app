import express from "express";
import isAuth from "../middleware/isAuth.js";
import { getCurrentUser } from "../controllers/user.controller.js";

const UserRouter = express.Router();


// Get currently logged-in user
UserRouter.get(
    "/me",
    isAuth,
    async (req, res) => {

        try {

            res.status(200).json({
                success: true,
                user: req.user
            });

        } catch (error) {

            console.error(
                "Get current user error:",
                error
            );

            res.status(500).json({
                success: false,
                message: "Failed to get current user"
            });

        }

    }
);


export default UserRouter;