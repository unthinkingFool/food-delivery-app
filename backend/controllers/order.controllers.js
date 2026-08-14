import pool from "../config/db.js";

export const createOrder = async (req, res) => {
  const client = await pool.connect();

  try {
    const customer_id = req.id;

    const { payment_method, delivery_address, latitude, longitude, cartItems } =
      req.body;

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!payment_method) {
      return res.status(400).json({
        message: "Payment method is required",
      });
    }

    if (payment_method !== "online" && payment_method !== "cod") {
      return res.status(400).json({
        message: "Invalid payment method",
      });
    }

    if (!delivery_address) {
      return res.status(400).json({
        message: "Delivery address is required",
      });
    }

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        message: "Delivery location is required",
      });
    }

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    // ==========================================
    // VALIDATE CART QUANTITIES
    // ==========================================

    for (const cartItem of cartItems) {
      if (!cartItem.id) {
        return res.status(400).json({
          message: "Item id is missing",
        });
      }

      if (
        !cartItem.quantity ||
        Number(cartItem.quantity) <= 0 ||
        !Number.isInteger(Number(cartItem.quantity))
      ) {
        return res.status(400).json({
          message: `Invalid quantity for item ${cartItem.id}`,
        });
      }
    }

    // ==========================================
    // START TRANSACTION
    // ==========================================

    await client.query("BEGIN");

    // ==========================================
    // GET ACTUAL ITEMS FROM DATABASE
    // ==========================================

    const verifiedItems = [];

    for (const cartItem of cartItems) {
      const itemResult = await client.query(
        `
        SELECT
          i.id,
          i.name,
          i.price,
          i.restaurant_id,
          r.owner_id,
          r.name AS restaurant_name
        FROM ITEM i
        INNER JOIN RESTAURANT r
          ON i.restaurant_id = r.id
        WHERE i.id = $1
        `,
        [cartItem.id],
      );

      if (itemResult.rows.length === 0) {
        throw new Error(`Item ${cartItem.id} not found`);
      }

      const databaseItem = itemResult.rows[0];

      verifiedItems.push({
        id: databaseItem.id,
        name: databaseItem.name,
        price: Number(databaseItem.price),
        restaurant_id: databaseItem.restaurant_id,
        owner_id: databaseItem.owner_id,
        restaurant_name: databaseItem.restaurant_name,
        quantity: Number(cartItem.quantity),
      });
    }

    // ==========================================
    // GROUP ITEMS BY RESTAURANT
    // ==========================================

    const restaurantGroups = {};

    for (const item of verifiedItems) {
      if (!restaurantGroups[item.restaurant_id]) {
        restaurantGroups[item.restaurant_id] = [];
      }

      restaurantGroups[item.restaurant_id].push(item);
    }

    // ==========================================
    // CALCULATE TOTAL AMOUNT
    // ==========================================

    let total_amount = 0;

    for (const item of verifiedItems) {
      total_amount += item.price * item.quantity;
    }

    // ==========================================
    // CREATE FOOD_ORDER
    // ==========================================

    const foodOrderResult = await client.query(
      `
      INSERT INTO FOOD_ORDER
      (
        customer_id,
        payment_method,
        delivery_address,
        latitude,
        longitude,
        total_amount
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [
        customer_id,
        payment_method,
        delivery_address,
        latitude,
        longitude,
        total_amount,
      ],
    );

    const foodOrder = foodOrderResult.rows[0];

    // ==========================================
    // CREATE SHOP_ORDER FOR EACH RESTAURANT
    // ==========================================

    const shopOrders = [];

    for (const restaurant_id of Object.keys(restaurantGroups)) {
      const restaurantItems = restaurantGroups[restaurant_id];

      const restaurant = restaurantItems[0];

      // ==========================================
      // CALCULATE RESTAURANT SUBTOTAL
      // ==========================================

      let subtotal = 0;

      for (const item of restaurantItems) {
        subtotal += item.price * item.quantity;
      }

      // ==========================================
      // CREATE SHOP_ORDER
      // ==========================================

      const shopOrderResult = await client.query(
        `
        INSERT INTO SHOP_ORDER
        (
          order_id,
          restaurant_id,
          owner_id,
          subtotal
        )
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `,
        [foodOrder.id, restaurant.restaurant_id, restaurant.owner_id, subtotal],
      );

      const shopOrder = shopOrderResult.rows[0];

      // ==========================================
      // CREATE ORDER_ITEM
      // ==========================================

      const orderItems = [];

      for (const item of restaurantItems) {
        const orderItemResult = await client.query(
          `
          INSERT INTO ORDER_ITEM
          (
            shop_order_id,
            item_id,
            restaurant_id,
            price,
            quantity
          )
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *
          `,
          [
            shopOrder.id,
            item.id,
            item.restaurant_id,
            item.price,
            item.quantity,
          ],
        );

        orderItems.push(orderItemResult.rows[0]);
      }

      shopOrders.push({
        ...shopOrder,
        restaurant_name: restaurant.restaurant_name,
        items: orderItems,
      });
    }

    // ==========================================
    // COMMIT TRANSACTION
    // ==========================================

    await client.query("COMMIT");

    // ==========================================
    // SUCCESS RESPONSE
    // ==========================================

    return res.status(201).json({
      message: "Order created successfully",

      order: {
        ...foodOrder,
        shopOrders,
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Error while creating order:", error);

    return res.status(500).json({
      message: `error while creating order : ${error.message}`,
    });
  } finally {
    client.release();
  }
};

