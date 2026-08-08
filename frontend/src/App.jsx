import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgetPassword from "./pages/ForgetPassword";
import VerifyOTP from "./pages/VerifyOTP";
import ResetPassword from "./pages/ResetPassword";


// Hook
import getCurrentUser from "../hooks/getCurrentUser";

function App() {
  // Check authentication when app starts
  getCurrentUser();

  // Get authentication state from Redux
  const { user, loading, isAuthenticated } = useSelector((state) => state.user);

  

  return (
    <BrowserRouter>
      <Routes>
        {/* ================= HOME ================= */}

        <Route
          path="/"
          element={user ? <Home /> : <Navigate to="/login" replace />}
        />

        {/* ================= AUTH ================= */}

        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" replace />}
        />

        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/" replace />}
        />

        <Route
          path="/forget-password"
          element={!user ? <ForgetPassword /> : <Navigate to="/" replace />}
        />

        <Route
          path="/verify-otp"
          element={!user ? <VerifyOTP /> : <Navigate to="/" replace />}
        />

        <Route
          path="/reset-password"
          element={!user ? <ResetPassword /> : <Navigate to="/" replace />}
        />

        {/* ================= UNKNOWN ROUTE ================= */}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
