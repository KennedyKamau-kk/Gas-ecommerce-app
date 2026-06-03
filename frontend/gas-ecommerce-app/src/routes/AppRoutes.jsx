import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Orders from "../pages/Order";
import Profile from "../pages/Profile";
import ProductDetails from "../pages/ProductDetails";
import Notifications from "../pages/Notifications";
import ProtectedRoute from "../components/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      /> 
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
    </Routes>    
  );
}