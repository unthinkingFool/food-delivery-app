import express from "express";

import { isAuth } from "../middlewares/isAuth.js";
import { createOrder } from "../controllers/order.controllers.js";

const orderRouter = express.Router();

orderRouter.post("/create", isAuth, createOrder);

export default orderRouter;