import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { serverUrl } from "../App";
import { clearCart } from "../redux/userSlice";

function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems, totalAmount } = useSelector((state) => state.user);
  
  const [payment_method, setPaymentMethod] = useState("cod");

  const [delivery_address, setDeliveryAddress] = useState("");

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      if (!delivery_address) {
        alert("Please enter your delivery address");
        return;
      }

      if (cartItems.length === 0) {
        alert("Your cart is empty");
        return;
      }

      if (latitude === "" || longitude === "") {
        alert("Delivery location is required");
        return;
      }

      setLoading(true);

      // ==========================================
      // ONLY SEND ITEM ID + QUANTITY
      // ==========================================

      const orderItems = cartItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
      }));

      const result = await axios.post(
        `${serverUrl}/api/order/create`,
        {
          payment_method,
          delivery_address,
          latitude,
          longitude,
          cartItems: orderItems,
        },
        {
          withCredentials: true,
        },
      );

      console.log("ORDER CREATED:", result.data);

      // ==========================================
      // CLEAR REDUX CART
      // ==========================================

      dispatch(clearCart());

      // ==========================================
      // GO TO ORDER SUCCESS / HOME
      // ==========================================

      navigate("/");
    } catch (error) {
      console.error("Error while creating order:", error);

      console.log("Backend response:", error.response?.data);

      alert(
        error.response?.data?.message ||
          "Something went wrong while creating the order",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Back */}
        <div
          onClick={() => {
            navigate("/cart");
          }}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-[#FF5A36] transition-colors cursor-pointer mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </div>
      <h1>Checkout</h1>

      <div>
        <h2>Total: ৳{totalAmount}</h2>
      </div>

      {/* Delivery Address */}

      <div>
        <label>Delivery Address</label>

        <input
          type="text"
          value={delivery_address}
          onChange={(e) => setDeliveryAddress(e.target.value)}
          placeholder="Enter delivery address"
        />
        <button>Search</button>
        <button>Current Address</button>

      </div>

      {/* Latitude */}

      <div>
        <label>Latitude</label>

        <input
          type="number"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
        />
      </div>

      {/* Longitude */}

      <div>
        <label>Longitude</label>

        <input
          type="number"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
        />
      </div>

      {/* Payment Method */}

      <div>
        <label>Payment Method</label>

        <select
          value={payment_method}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="cod">Cash on Delivery</option>

          <option value="online">Online Payment</option>
        </select>
      </div>

      {/* Checkout */}

      <button onClick={handleCheckout} disabled={loading}>
        {loading ? "Creating Order..." : "Place Order"}
      </button>
    </div>
  );
}

export default CheckoutPage;
